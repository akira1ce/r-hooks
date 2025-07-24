import { useCallback, useEffect, useRef, useState } from "react";

export interface UseRequestOptions {
	/** 是否手动触发 */
	manual?: boolean;
	/** 轮询间隔 */
	pollingInterval?: number;
	/** 轮询重试次数 */
	pollingRetryCount?: number;
}

export type Service<TData, TParams> = (params?: TParams) => Promise<TData>;

/**
 * 请求
 * @param api 请求函数
 * @param options 选项
 */
export const useRequest = <TData, TParams>(
	api: Service<TData, TParams>,
	options: UseRequestOptions = {},
) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<TData>();

	/* 轮询定时器 */
	const timer = useRef<any>(null);
	const retryCount = useRef(0);

	const { manual = false, pollingInterval, pollingRetryCount } = options;

	/* 取消轮询 */
	const cancel = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
			retryCount.current = 0;
		}
	}, []);

	/* 轮询 */
	const _loop = useCallback((params?: TParams) => {
		/* 轮询重试次数为 -1 时，无限轮询 */
		if (
			pollingRetryCount !== -1 &&
			pollingRetryCount &&
			retryCount.current >= pollingRetryCount
		) {
			return;
		}
		retryCount.current++;
		timer.current = setTimeout(() => {
			run(params);
		}, pollingInterval);
	}, []);

	/* 执行请求 */
	const run = useCallback(async (params?: TParams) => {
		try {
			setLoading(true);
			const res = await api(params);
			setData(res);
			setLoading(false);
			if (pollingInterval) _loop(params);
			return res;
		} catch (err) {
			setLoading(false);
			console.error(err);
		}
	}, []);

	/* 手动触发 */
	useEffect(() => {
		if (!manual) run();
	}, []);

	return { data, loading, cancel, run };
};
