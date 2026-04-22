# useWebSocket

A fully-featured React WebSocket Hook with auto-reconnect, heartbeat, and offline message queuing.

## Usage

```tsx
import { useWebSocket } from "r-hooks";

const MyComponent = () => {
	const { status, send, disconnect } = useWebSocket("wss://example.com/ws", {
		onMessage: (msg) => console.log(msg),
		onReconnected: () => fetchLatestData(),
	});

	return (
		<div>
			<span>{status}</span>
			<button onClick={() => send("chat", { text: "hello" })}>Send</button>
			<button onClick={disconnect}>Disconnect</button>
		</div>
	);
};
```

## API

### Parameters

| Property | Description           | Type                  | Default |
| -------- | --------------------- | --------------------- | ------- |
| url      | WebSocket endpoint    | `string`              | `-`     |
| options  | Configuration options | `UseWebSocketOptions` | `{}`    |

### UseWebSocketOptions

| Property               | Description                                                                    | Type                              | Default                   |
| ---------------------- | ------------------------------------------------------------------------------ | --------------------------------- | ------------------------- |
| autoConnect            | Connect automatically on mount                                                 | `boolean`                         | `true`                    |
| heartbeatInterval      | Interval between heartbeat pings (ms)                                          | `number`                          | `25000`                   |
| heartbeatTimeout       | Time to wait for pong before closing (ms)                                      | `number`                          | `10000`                   |
| heartbeatMessage       | Custom ping message                                                            | `string`                          | `'{"type":"ping"}'`       |
| maxRetries             | Maximum reconnect attempts. Set to `Infinity` to retry forever                 | `number`                          | `10`                      |
| reconnectBaseDelay     | Initial reconnect delay (ms)                                                   | `number`                          | `1000`                    |
| reconnectMaxDelay      | Maximum reconnect delay after backoff (ms)                                     | `number`                          | `30000`                   |
| reconnectBackoffFactor | Exponential backoff multiplier                                                 | `number`                          | `2`                       |
| reconnectJitter        | Jitter factor applied to backoff delay `0~1`                                   | `number`                          | `0.3`                     |
| queueMaxSize           | Maximum number of messages held in the offline queue                           | `number`                          | `200`                     |
| queueMessageTTL        | Maximum time a queued message is kept before being dropped (ms)                | `number`                          | `300000`                  |
| messageSendMaxRetries  | Maximum send retries per message before dropping                               | `number`                          | `3`                       |
| protocols              | WebSocket sub-protocols                                                        | `string \| string[]`              | `-`                       |
| getUrl                 | Dynamically resolve the WebSocket URL, supports async (e.g. inject auth token) | `() => string \| Promise<string>` | `-`                       |
| isPong                 | Custom pong detection function                                                 | `(raw: string) => boolean`        | matches `type === 'pong'` |
| serialize              | Custom message serializer                                                      | `(msg: WsMessage<T>) => string`   | `JSON.stringify`          |
| deserialize            | Custom message deserializer                                                    | `(raw: string) => WsMessage<T>`   | `JSON.parse`              |
| onOpen                 | Fired when the connection is established                                       | `(event: Event) => void`          | `-`                       |
| onClose                | Fired when the connection is closed                                            | `(event: CloseEvent) => void`     | `-`                       |
| onError                | Fired on connection error                                                      | `(event: Event) => void`          | `-`                       |
| onMessage              | Fired when a business message is received                                      | `(message: WsMessage<T>) => void` | `-`                       |
| onPong                 | Fired when a pong is received                                                  | `() => void`                      | `-`                       |

### Return Value

| Property        | Description                                                            | Type                                   |
| --------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| status          | Current connection status                                              | `WsStatus`                             |
| retryCount      | Number of reconnect attempts so far                                    | `number`                               |
| queueSize       | Number of messages waiting in the offline queue                        | `number`                               |
| lastConnectedAt | Timestamp of the last successful connection                            | `number \| null`                       |
| send            | Send a message. Automatically queued when offline. Returns `messageId` | `(type: string, payload: T) => string` |
| connect         | Manually initiate a connection                                         | `() => void`                           |
| disconnect      | Disconnect without triggering reconnect                                | `() => void`                           |
| clearQueue      | Clear all messages in the offline queue                                | `() => void`                           |

### WsStatus

| Value          | Description                                |
| -------------- | ------------------------------------------ |
| `idle`         | Initial state, not yet connected           |
| `connecting`   | Connection in progress                     |
| `connected`    | Successfully connected                     |
| `reconnecting` | Attempting to reconnect after a drop       |
| `disconnected` | Manually disconnected                      |
| `failed`       | Max retries exceeded, gave up reconnecting |
