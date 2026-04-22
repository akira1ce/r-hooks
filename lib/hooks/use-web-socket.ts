import { useCallback, useEffect, useRef, useState } from "react";

export type WsStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "failed";

export interface WsMessage<T = unknown> {
	/** 业务幂等键，服务端需根据此键去重 */
	messageId: string;
	/** 业务类型 */
	type: string;
	payload: T;
	/** 发送时间戳（ms） */
	timestamp: number;
}

export interface QueuedMessage<T = unknown> {
	message: WsMessage<T>;
	/** 已重试次数 */
	retries: number;
	/** 首次入队时间 */
	enqueuedAt: number;
}

export interface UseWebSocketOptions<T = unknown> {
	/** 自动连接，默认 true */
	autoConnect?: boolean;

	/** 心跳间隔(ms)，默认 25_000 */
	heartbeatInterval?: number;
	/** 心跳超时(ms)，默认 10_000 */
	heartbeatTimeout?: number;
	/** 自定义心跳消息，默认 { type: 'ping' } */
	heartbeatMessage?: string;

	/** 最大重连次数，默认 10；设为 Infinity 永久重试 */
	maxRetries?: number;
	/** 初始重连延迟(ms)，默认 1_000 */
	reconnectBaseDelay?: number;
	/** 指数退避上限(ms)，默认 30_000 */
	reconnectMaxDelay?: number;
	/** 退避倍率，默认 2 */
	reconnectBackoffFactor?: number;
	/** 退避抖动系数 0~1，默认 0.3 */
	reconnectJitter?: number;

	/** 队列最大容量，默认 200 */
	queueMaxSize?: number;
	/** 队列消息最大存活时间(ms)，默认 300_000 (5min) */
	queueMessageTTL?: number;
	/** 消息发送失败最大重试次数，默认 3 */
	messageSendMaxRetries?: number;

	onOpen?: (event: Event) => void;
	onClose?: (event: CloseEvent) => void;
	onError?: (event: Event) => void;
	onMessage?: (message: WsMessage<T>) => void;

	/** 收到 pong 时回调 */
	onPong?: () => void;
	/** 判断消息是否为 pong，默认匹配 type === 'pong' */
	isPong?: (raw: string) => boolean;
	/** 自定义 JSON 序列化，默认 JSON.stringify */
	serialize?: (msg: WsMessage<T>) => string;
	/** 自定义 JSON 反序列化 */
	deserialize?: (raw: string) => WsMessage<T>;

	protocols?: string | string[];
	/** 请求 URL，支持函数（可注入动态 token） */
	getUrl?: () => string | Promise<string>;
}

export interface UseWebSocketReturn<T = unknown> {
	status: WsStatus;
	retryCount: number;
	/** 离线队列中待发送的消息数 */
	queueSize: number;
	/** 最近一次成功连接时间 */
	lastConnectedAt: number | null;
	/** 发送消息（断线时自动入队） */
	send: (type: string, payload: T) => string; // 返回 messageId
	/** 手动连接 */
	connect: () => void;
	/** 主动断开（不触发重连） */
	disconnect: () => void;
	/** 清空离线队列 */
	clearQueue: () => void;
}

let _msgCounter = 0;
function generateMessageId(): string {
	return `${Date.now()}-${++_msgCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function computeDelay(retry: number, base: number, max: number, factor: number, jitter: number): number {
	const exp = Math.min(base * Math.pow(factor, retry), max);
	return exp + exp * jitter * (Math.random() * 2 - 1);
}

const isPongFn = (raw: string) => {
	try {
		return JSON.parse(raw)?.type === "pong";
	} catch {
		return raw === "pong";
	}
};

export function useWebSocket<T = unknown>(url: string, options: UseWebSocketOptions<T> = {}): UseWebSocketReturn<T> {
	const {
		autoConnect = true,
		heartbeatInterval = 25_000,
		heartbeatTimeout = 10_000,
		heartbeatMessage = '{"type":"ping"}',
		maxRetries = 10,
		reconnectBaseDelay = 1_000,
		reconnectMaxDelay = 30_000,
		reconnectBackoffFactor = 2,
		reconnectJitter = 0.3,
		queueMaxSize = 200,
		queueMessageTTL = 300_000,
		isPong = isPongFn,
		serialize = JSON.stringify,
		deserialize = JSON.parse,
		protocols,
	} = options;

	const [status, setStatus] = useState<WsStatus>("idle");
	const [retryCount, setRetryCount] = useState(0);
	const [queueSize, setQueueSize] = useState(0);
	const [lastConnectedAt, setLastConnectedAt] = useState<number | null>(null);

	const wsRef = useRef<WebSocket | null>(null);
	const retryRef = useRef(0);
	const manualCloseRef = useRef(false);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const heartbeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const messageQueueRef = useRef<QueuedMessage<T>[]>([]);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	const clearHeartbeat = useCallback(() => {
		if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
		if (pongTimeoutRef.current) clearTimeout(pongTimeoutRef.current);
		heartbeatTimerRef.current = null;
		pongTimeoutRef.current = null;
	}, []);

	const startHeartbeat = useCallback(() => {
		clearHeartbeat();
		heartbeatTimerRef.current = setInterval(() => {
			const ws = wsRef.current;
			if (!ws || ws.readyState !== WebSocket.OPEN) return;

			// 发送 ping
			const msg = heartbeatMessage;
			ws.send(msg);

			// 等待 pong
			pongTimeoutRef.current = setTimeout(() => {
				console.warn("[useWebSocket] Pong timeout — closing for reconnect");
				ws.close(4408, "Heartbeat timeout");
			}, heartbeatTimeout);
		}, heartbeatInterval);
	}, []);

	const syncQueueSize = useCallback(() => {
		setQueueSize(messageQueueRef.current.length);
	}, []);

	/** 清除已过期的队列消息 */
	const pruneExpiredMessages = useCallback(() => {
		const now = Date.now();
		messageQueueRef.current = messageQueueRef.current.filter((q) => now - q.enqueuedAt < queueMessageTTL);
		syncQueueSize();
	}, []);

	/** 发送单条队列消息，失败则重新入队 */
	const flushOne = useCallback((queued: QueuedMessage<T>) => {
		const ws = wsRef.current;
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			// 重新推回队列
			messageQueueRef.current.push(queued);
			syncQueueSize();
			return;
		}
		try {
			ws.send(serialize(queued.message));
		} catch (err) {
			if (queued.retries < (optionsRef.current.messageSendMaxRetries ?? 3)) {
				messageQueueRef.current.push({ ...queued, retries: queued.retries + 1 });
			} else {
				console.error("[useWebSocket] Message dropped after max retries:", queued.message, err);
			}
			syncQueueSize();
		}
	}, []);

	/** 连接成功后批量刷新队列 */
	const flushQueue = useCallback(() => {
		pruneExpiredMessages();
		const queue = [...messageQueueRef.current];
		messageQueueRef.current = [];
		syncQueueSize();
		queue.forEach(flushOne);
	}, []);

	const connect = useCallback(async () => {
		if (
			wsRef.current &&
			(wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
		) {
			return;
		}

		manualCloseRef.current = false;
		setStatus(retryRef.current > 0 ? "reconnecting" : "connecting");

		let resolvedUrl = url;
		const { getUrl } = optionsRef.current;

		try {
			if (getUrl) resolvedUrl = await getUrl();
		} catch (err) {
			console.error("[useWebSocket] getUrl failed:", err);
		}

		let ws: WebSocket;
		try {
			ws = protocols ? new WebSocket(resolvedUrl, protocols) : new WebSocket(resolvedUrl);
		} catch (err) {
			console.error("[useWebSocket] WebSocket construction failed:", err);
			setStatus("failed");
			return;
		}

		wsRef.current = ws;

		ws.onopen = (event) => {
			retryRef.current = 0;
			setRetryCount(0);
			setStatus("connected");
			setLastConnectedAt(Date.now());
			startHeartbeat();
			flushQueue();
			optionsRef.current.onOpen?.(event);
		};

		ws.onmessage = (event) => {
			const raw: string = typeof event.data === "string" ? event.data : "";

			// pong 处理（心跳回包）
			if (isPong(raw)) {
				if (pongTimeoutRef.current) {
					clearTimeout(pongTimeoutRef.current);
					pongTimeoutRef.current = null;
				}
				optionsRef.current.onPong?.();
				return;
			}

			// 业务消息
			try {
				const message = deserialize(raw) as WsMessage<T>;
				optionsRef.current.onMessage?.(message);
			} catch (err) {
				console.error("[useWebSocket] Deserialize error:", err, raw);
			}
		};

		ws.onerror = (event) => {
			optionsRef.current.onError?.(event);
		};

		ws.onclose = (event) => {
			clearHeartbeat();
			optionsRef.current.onClose?.(event);

			if (manualCloseRef.current) {
				setStatus("disconnected");
				return;
			}

			const nextRetry = retryRef.current + 1;

			if (nextRetry > maxRetries) {
				setStatus("failed");
				console.error("[useWebSocket] Max retries reached. Giving up.");
				return;
			}

			retryRef.current = nextRetry;
			setRetryCount(nextRetry);
			setStatus("reconnecting");

			const delay = computeDelay(
				nextRetry,
				reconnectBaseDelay,
				reconnectMaxDelay,
				reconnectBackoffFactor,
				reconnectJitter
			);

			console.info(`[useWebSocket] Reconnecting in ${Math.round(delay)}ms (attempt ${nextRetry}/${maxRetries})`);

			reconnectTimerRef.current = setTimeout(() => {
				connect();
			}, delay);
		};
	}, [url, protocols]);

	const disconnect = useCallback(() => {
		manualCloseRef.current = true;
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current);
			reconnectTimerRef.current = null;
		}
		clearHeartbeat();
		wsRef.current?.close(1000, "Manual disconnect");
		wsRef.current = null;
		setStatus("disconnected");
	}, []);

	const send = useCallback((type: string, payload: T): string => {
		const messageId = generateMessageId();
		const message: WsMessage<T> = {
			messageId,
			type,
			payload,
			timestamp: Date.now(),
		};

		const ws = wsRef.current;

		if (ws && ws.readyState === WebSocket.OPEN) {
			try {
				ws.send(serialize(message));
				return messageId;
			} catch (err) {
				console.warn("[useWebSocket] Send failed, enqueuing:", err);
			}
		}

		// 离线入队
		if (messageQueueRef.current.length >= queueMaxSize) {
			console.warn("[useWebSocket] Queue full, dropping oldest message");
			messageQueueRef.current.shift();
		}

		messageQueueRef.current.push({
			message,
			retries: 0,
			enqueuedAt: Date.now(),
		});
		syncQueueSize();

		return messageId;
	}, []);

	const clearQueue = useCallback(() => {
		messageQueueRef.current = [];
		syncQueueSize();
	}, []);

	useEffect(() => {
		if (autoConnect) connect();
		return () => {
			manualCloseRef.current = true;
			if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
			clearHeartbeat();
			wsRef.current?.close(1000, "Unmount");
		};
	}, []);

	return {
		status,
		retryCount,
		queueSize,
		lastConnectedAt,
		send,
		connect,
		disconnect,
		clearQueue,
	};
}
