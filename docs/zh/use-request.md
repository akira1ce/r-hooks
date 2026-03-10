# useRequest

一个处理 API 请求的 React Hook，支持加载状态、手动触发和轮询功能。

## 用法

```typescript
import { useRequest } from 'r-hooks'

// 基础用法 - 挂载时自动触发
const BasicExample = () => {
  const fetchUser = async (id) => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }

  const { data, loading, run } = useRequest(fetchUser)

  return (
    <div>
      {loading ? <p>加载中...</p> : <p>用户: {data?.name}</p>}
    </div>
  )
}

// 手动触发
const ManualExample = () => {
  const { data, loading, run, cancel } = useRequest(fetchUser, {
    manual: true
  })

  return (
    <div>
      <button onClick={() => run(123)} disabled={loading}>
        获取用户 123
      </button>
      <button onClick={cancel}>取消</button>
      {data && <p>用户: {data.name}</p>}
    </div>
  )
}

// 轮询
const PollingExample = () => {
  const { data, loading, cancel } = useRequest(fetchStatus, {
    pollingInterval: 1000, // 每秒轮询
    pollingRetryCount: 10  // 10 次后停止
  })

  return (
    <div>
      <p>状态: {data?.status}</p>
      <button onClick={cancel}>停止轮询</button>
    </div>
  )
}
```

## Api

### 参数

| 属性    | 说明           | 类型                      | 默认值 |
| ------- | -------------- | ------------------------- | ------ |
| api     | API 服务函数   | `Service<TData, TParams>` | `-`    |
| options | 可选配置       | `UseRequestOptions`       | `{}`   |

#### UseRequestOptions

| 属性              | 说明                             | 类型      | 默认值      |
| ----------------- | -------------------------------- | --------- | ----------- |
| manual            | 是否手动触发请求                 | `boolean` | `false`     |
| pollingInterval   | 轮询间隔时间（毫秒）            | `number`  | `undefined` |
| pollingRetryCount | 轮询重试次数（-1 为无限重试）    | `number`  | `undefined` |

#### Service 类型

```typescript
type Service<TData, TParams> = (params?: TParams) => Promise<TData>;
```

### 返回值

| 属性    | 说明                 | 类型                                 |
| ------- | -------------------- | ------------------------------------ | ----------- |
| data    | 响应数据             | `TData                               | undefined`  |
| loading | 请求是否进行中       | `boolean`                            |
| run     | 手动触发请求的函数   | `(params?: TParams) => Promise<TData | undefined>` |
| cancel  | 取消轮询的函数       | `() => void`                         |
