# useWebSocket

一个功能完整的 React WebSocket Hook，支持自动重连、心跳保活、离线消息队列等特性。

## 用法

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
			<button onClick={() => send("chat", { text: "hello" })}>发送</button>
			<button onClick={disconnect}>断开</button>
		</div>
	);
};
```

## API

### 参数

| 属性    | 说明               | 类型                  | 默认值 |
| ------- | ------------------ | --------------------- | ------ |
| url     | WebSocket 连接地址 | `string`              | `-`    |
| options | 配置项             | `UseWebSocketOptions` | `{}`   |

### UseWebSocketOptions

| 属性                   | 说明                                           | 类型                              | 默认值                 |
| ---------------------- | ---------------------------------------------- | --------------------------------- | ---------------------- |
| autoConnect            | 是否自动连接                                   | `boolean`                         | `true`                 |
| heartbeatInterval      | 心跳间隔(ms)                                   | `number`                          | `25000`                |
| heartbeatTimeout       | 心跳超时(ms)                                   | `number`                          | `10000`                |
| heartbeatMessage       | 自定义心跳消息                                 | `string`                          | `'{"type":"ping"}'`    |
| maxRetries             | 最大重连次数，设为 `Infinity` 永久重试         | `number`                          | `10`                   |
| reconnectBaseDelay     | 初始重连延迟(ms)                               | `number`                          | `1000`                 |
| reconnectMaxDelay      | 指数退避上限(ms)                               | `number`                          | `30000`                |
| reconnectBackoffFactor | 退避倍率                                       | `number`                          | `2`                    |
| reconnectJitter        | 退避抖动系数 `0~1`                             | `number`                          | `0.3`                  |
| queueMaxSize           | 离线队列最大容量                               | `number`                          | `200`                  |
| queueMessageTTL        | 队列消息最大存活时间(ms)                       | `number`                          | `300000`               |
| messageSendMaxRetries  | 消息发送失败最大重试次数                       | `number`                          | `3`                    |
| protocols              | WebSocket 子协议                               | `string \| string[]`              | `-`                    |
| getUrl                 | 动态获取连接地址，支持异步（可用于注入 token） | `() => string \| Promise<string>` | `-`                    |
| isPong                 | 自定义 pong 判断函数                           | `(raw: string) => boolean`        | 匹配 `type === 'pong'` |
| serialize              | 自定义序列化函数                               | `(msg: WsMessage<T>) => string`   | `JSON.stringify`       |
| deserialize            | 自定义反序列化函数                             | `(raw: string) => WsMessage<T>`   | `JSON.parse`           |
| onOpen                 | 连接建立时回调                                 | `(event: Event) => void`          | `-`                    |
| onClose                | 连接关闭时回调                                 | `(event: CloseEvent) => void`     | `-`                    |
| onError                | 连接出错时回调                                 | `(event: Event) => void`          | `-`                    |
| onMessage              | 收到业务消息时回调                             | `(message: WsMessage<T>) => void` | `-`                    |
| onPong                 | 收到 pong 时回调                               | `() => void`                      | `-`                    |

### 返回值

| 属性            | 说明                                       | 类型                                   |
| --------------- | ------------------------------------------ | -------------------------------------- |
| status          | 当前连接状态                               | `WsStatus`                             |
| retryCount      | 当前重连次数                               | `number`                               |
| queueSize       | 离线队列中待发送的消息数                   | `number`                               |
| lastConnectedAt | 最近一次成功连接时间                       | `number \| null`                       |
| send            | 发送消息，断线时自动入队，返回 `messageId` | `(type: string, payload: T) => string` |
| connect         | 手动连接                                   | `() => void`                           |
| disconnect      | 主动断开，不触发重连                       | `() => void`                           |
| clearQueue      | 清空离线队列                               | `() => void`                           |

### WsStatus

| 值             | 说明                       |
| -------------- | -------------------------- |
| `idle`         | 初始状态，未连接           |
| `connecting`   | 连接中                     |
| `connected`    | 已连接                     |
| `reconnecting` | 重连中                     |
| `disconnected` | 已主动断开                 |
| `failed`       | 超出最大重连次数，放弃重连 |
