# useXStream

一个处理服务器发送事件（SSE）和流式数据的 React Hook，支持取消操作。

## 用法

```typescript
import { useXStream } from 'r-hooks'

const StreamingComponent = () => {
  const fetcher = async (params, signal) => {
    return fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal
    })
  }

  const { content, loading, error, run, cancel } = useXStream(fetcher, {
    transform: (chunk) => chunk.replace('data: ', '')
  })

  const handleStart = () => {
    run({ query: 'Hello world' })
  }

  return (
    <div>
      <button onClick={handleStart} disabled={loading}>
        {loading ? '流式传输中...' : '开始流式传输'}
      </button>
      <button onClick={cancel}>取消</button>

      {error && <p>错误: {error.message}</p>}
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  )
}
```

## Api

### 参数

| 属性    | 说明                   | 类型                | 默认值 |
| ------- | ---------------------- | ------------------- | ------ |
| fetcher | 返回流式响应的请求函数 | `Fetcher`           | `-`    |
| options | 可选配置               | `UseXStreamOptions` | `{}`   |

#### UseXStreamOptions

| 属性      | 说明                     | 类型                        | 默认值      |
| --------- | ------------------------ | --------------------------- | ----------- |
| transform | 转换每个数据块的函数     | `(value: string) => string` | `undefined` |

#### Fetcher 类型

```typescript
type Fetcher = (params: any, signal?: AbortSignal) => Promise<Response>;
```

### 返回值

| 属性    | 说明                 | 类型                    |
| ------- | -------------------- | ----------------------- | ----- |
| content | 累积的流式内容       | `string`                |
| loading | 流是否正在传输       | `boolean`               |
| error   | 流式传输中的错误对象 | `Error                  | null` |
| run     | 开始流式传输的函数   | `(params: any) => void` |
| cancel  | 取消当前流的函数     | `() => void`            |
