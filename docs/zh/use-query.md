# useQuery

一个管理异步数据请求的 React Hook，支持加载状态、错误处理和手动触发。

## 用法

```typescript
import { useQuery } from 'r-hooks'

// 基础用法 - 自动触发
const UserProfile = () => {
  const fetchUser = async (params?: { id: string }) => {
    const response = await fetch(`/api/user/${params?.id}`)
    return response.json()
  }

  const { data, loading, error, run } = useQuery(fetchUser, {
    defaultParams: { id: '123' },
    defaultData: null
  })

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return <div>{data?.name}</div>
}

// 手动触发模式
const SearchResults = () => {
  const [keyword, setKeyword] = useState('')

  const search = async (params?: { keyword: string }) => {
    const response = await fetch(`/api/search?q=${params?.keyword}`)
    return response.json()
  }

  const { data, loading, run } = useQuery(search, {
    manual: true,
    defaultData: []
  })

  const handleSearch = () => {
    run({ keyword })
  }

  return (
    <div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={handleSearch} disabled={loading}>
        搜索
      </button>
      {data.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  )
}
```

## Api

### 参数

| 属性    | 说明               | 类型                              | 默认值 |
| ------- | ------------------ | --------------------------------- | ------ |
| api     | 要执行的异步函数   | `Service<TData, TParams>`         | `-`    |
| options | 可选配置           | `UseQueryOptions<TParams, TData>` | `{}`   |

#### UseQueryOptions

| 属性          | 说明                 | 类型      | 默认值      |
| ------------- | -------------------- | --------- | ----------- |
| manual        | 是否手动触发请求     | `boolean` | `false`     |
| defaultParams | API 调用的默认参数   | `TParams` | `{}`        |
| defaultData   | 默认数据值           | `TData`   | `undefined` |

#### Service

| 属性    | 说明             | 类型                                   |
| ------- | ---------------- | -------------------------------------- |
| Service | API 调用的异步函数类型 | `(params?: TParams) => Promise<TData>` |

### 返回值

| 属性    | 说明                 | 类型                                  |
| ------- | -------------------- | ------------------------------------- |
| data    | API 返回的响应数据   | `TData`                               |
| loading | 请求是否进行中       | `boolean`                             |
| error   | 请求失败时的错误对象 | `Error \| null`                       |
| run     | 手动触发请求的函数   | `(params?: TParams) => Promise<void>` |
| params  | 当前使用的请求参数   | `TParams`                             |
