# useTable

一个处理表格数据请求的 React Hook，提供增强的错误处理、类型安全和参数管理。

## 用法

```typescript
import { useTable } from 'r-hooks'

interface User {
  id: number
  name: string
  email: string
}

interface TableParams {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
}

const UserTable = () => {
  const fetchUsers = async (params: TableParams) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json() // 返回 { list: User[], total: number }
  }

  const { data, loading, total, run, params } = useTable(fetchUsers, {
    defaultParams: { page: 1, pageSize: 10 },
    manual: false // 挂载时自动请求
  })

  const handleSearch = (search: string) => {
    run({ search, page: 1 }) // 搜索时重置到第 1 页
  }

  const handlePageChange = (page: number) => {
    run({ page })
  }

  return (
    <div>
      <input
        placeholder="搜索用户..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <p>加载中...</p>}

      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <p>共 {total} 位用户</p>
        <p>当前页: {params.page}</p>
        <button onClick={() => handlePageChange(params.page - 1)} disabled={params.page === 1}>
          上一页
        </button>
        <button onClick={() => handlePageChange(params.page + 1)}>
          下一页
        </button>
      </div>
    </div>
  )
}

// 手动模式示例
const ManualTableExample = () => {
  const { data, loading, run } = useTable(fetchUsers, {
    defaultParams: { page: 1, pageSize: 10 },
    manual: true // 不自动请求
  })

  return (
    <div>
      <button onClick={() => run()}>加载数据</button>
      {/* 其余组件 */}
    </div>
  )
}
```

## Api

### 参数

| 属性    | 说明                     | 类型                 | 默认值 |
| ------- | ------------------------ | -------------------- | ------ |
| api     | 返回表格数据的 API 函数  | `UseTableApi<T, K>`  | `-`    |
| options | 可选配置                 | `UseTableOptions<T>` | `{}`   |

#### UseTableOptions

| 属性          | 说明                 | 类型      | 默认值      |
| ------------- | -------------------- | --------- | ----------- |
| defaultParams | API 调用的默认参数   | `T`       | `undefined` |
| manual        | 是否手动触发请求     | `boolean` | `false`     |

#### UseTableApi 类型

```typescript
type UseTableApi<T, K> = (params: T) => Promise<UseTableResponse<K>>;
```

#### UseTableResponse 接口

| 属性          | 说明             | 类型      | 默认值 |
| ------------- | ---------------- | --------- | ------ |
| total         | 总记录数         | `number`  | `-`    |
| list          | 表格数据数组     | `K[]`     | `-`    |
| [key: string] | 其他响应属性     | `unknown` | `-`    |

### 返回值

| 属性    | 说明                         | 类型                                    |
| ------- | ---------------------------- | --------------------------------------- |
| data    | 表格数据数组                 | `K[]`                                   |
| loading | 请求是否进行中               | `boolean`                               |
| total   | 总记录数                     | `number`                                |
| run     | 触发 API 调用的函数（支持部分参数） | `(params: Partial<T>) => Promise<void>` |
| params  | 当前使用的参数               | `T`                                     |
