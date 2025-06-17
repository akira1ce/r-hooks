# useXStream

流式请求 hook，用于处理 SSE (Server-Sent Events) 和流式数据。

## 功能

- 流式数据接收和处理
- 自定义数据转换
- 请求状态管理
- 支持请求取消

## 用法

```tsx
import { useXStream } from 'r-hooks';

const streamFetcher = async (params, signal) => {
  return fetch('/api/stream', {
    method: 'POST',
    body: JSON.stringify(params),
    signal,
  });
};

function StreamComponent() {
  const { content, loading, error, run, cancel } = useXStream(streamFetcher, {
    transform: (chunk) => chunk + '\n', // 可选的数据转换
  });

  const handleStart = () => {
    run({ query: 'Hello AI' });
  };

  return (
    <div>
      <button onClick={handleStart} disabled={loading}>
        {loading ? '流式处理中...' : '开始流式请求'}
      </button>
      <button onClick={cancel}>取消</button>
      <pre>{content}</pre>
      {error && <div>错误: {error.message}</div>}
    </div>
  );
}
```

## 入参类型

```typescript
export type Fetcher = (params: any, signal?: AbortSignal) => Promise<Response>;

export interface UseXStreamOptions {
  transform?: (value: string) => string;
}

function useXStream(
  fetcher: Fetcher, 
  options?: UseXStreamOptions
): {
  content: string;
  loading: boolean;
  error: Error | null;
  run: (params: any) => Promise<void>;
  cancel: () => void;
}
```

## 返回类型

| 属性    | 类型                             | 描述           |
| ------- | -------------------------------- | -------------- |
| content | `string`                         | 累积的流式内容 |
| loading | `boolean`                        | 请求状态       |
| error   | `Error \| null`                  | 错误信息       |
| run     | `(params: any) => Promise<void>` | 开始流式请求   |
| cancel  | `() => void`                     | 取消请求       |