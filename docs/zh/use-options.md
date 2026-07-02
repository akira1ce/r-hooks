# useOptions

基于 `useQuery` 的 React Hook，自动从 API 响应中提取数组并转换为 `{ label, value }[]` 格式 — 适用于填充下拉菜单、选择器和自动完成组件。

## 用法

```typescript
import { useOptions } from 'r-hooks'

interface SystemDTO {
  id: number
  name: string
  status: string
}

const SystemSelect = () => {
  const fetchSystems = async (params?: { pageSize: number }) => {
    const response = await fetch('/api/systems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
    // 响应结构: { res: { list: SystemDTO[], total: number } }
  }

  const { options, optionsMap, data, loading, run } = useOptions(fetchSystems, {
    listPath: 'res.list',
    labelPath: 'name',
    valuePath: 'id',
    defaultParams: { pageSize: 0 },
  })

  return (
    <Select loading={loading}>
      {options.map(opt => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  )
}

// 手动触发 + 搜索
const SearchableSelect = () => {
  const [keyword, setKeyword] = useState('')

  const searchSystems = async (params?: { keyword: string }) => {
    const response = await fetch(`/api/systems/search?q=${params?.keyword}`)
    return response.json()
    // 响应结构: { data: { items: SystemDTO[] } }
  }

  const { options, optionsMap, loading, run } = useOptions(searchSystems, {
    listPath: 'data.items',
    labelPath: 'name',
    valuePath: 'id',
    manual: true,
    defaultData: { data: { items: [] } },
  })

  // 通过 value 快速查找对应选项
  const selectedOption = optionsMap['42']

  return (
    <div>
      <input
        placeholder="搜索系统..."
        onChange={(e) => run({ keyword: e.target.value })}
      />
      <Select loading={loading}>
        {options.map(opt => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </div>
  )
}
```

## Api

### 参数

| 属性   | 说明                   | 类型                              | 默认值 |
| ------ | ---------------------- | --------------------------------- | ------ |
| api    | 要执行的异步函数       | `Service<TData, TParams>`         | `-`    |
| config | 提取与请求的配置项     | `UseOptionsConfig<TParams, TData>` | `-`    |

#### UseOptionsConfig

| 属性      | 说明                                  | 类型     | 默认值 |
| --------- | ------------------------------------- | -------- | ------ |
| listPath  | 响应中数组字段的点号分隔路径          | `string` | `-`    |
| labelPath | 映射为 `option.label` 的字段路径      | `string` | `-`    |
| valuePath | 映射为 `option.value` 的字段路径      | `string` | `-`    |

继承自 `UseQueryOptions` 的所有选项：

| 属性          | 说明               | 类型      | 默认值      |
| ------------- | ------------------ | --------- | ----------- |
| manual        | 是否手动触发请求   | `boolean` | `false`     |
| defaultParams | API 调用的默认参数 | `TParams` | `{}`        |
| defaultData   | 默认数据值         | `TData`   | `undefined` |

### 返回值

| 属性        | 说明                              | 类型                                          |
| ----------- | --------------------------------- | --------------------------------------------- |
| data        | API 返回的原始响应数据            | `TData`                                       |
| loading     | 请求是否进行中                    | `boolean`                                     |
| error       | 请求失败时的错误对象              | `Error \| null`                               |
| run         | 手动触发请求的函数                | `(params?: TParams) => Promise<void>`         |
| params      | 当前使用的请求参数                | `TParams`                                     |
| options     | 标准化后的 `{ label, value }` 数组 | `OptionItem[]`                                |
| optionsMap  | 以 value 为键的选项映射表          | `Record<string, OptionItem>`                  |

#### OptionItem

| 属性  | 说明           | 类型     |
| ----- | -------------- | -------- |
| label | 选项的展示文本 | `string` |
| value | 选项的唯一标识 | `string` |
