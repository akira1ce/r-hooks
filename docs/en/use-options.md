# useOptions

A React hook built on top of `useQuery` that automatically extracts and transforms API response data into `{ label, value }[]` format — ideal for populating dropdowns, select menus, and autocomplete components.

## usage

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
    // Response shape: { res: { list: SystemDTO[], total: number } }
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

// Manual trigger with search
const SearchableSelect = () => {
  const [keyword, setKeyword] = useState('')

  const searchSystems = async (params?: { keyword: string }) => {
    const response = await fetch(`/api/systems/search?q=${params?.keyword}`)
    return response.json()
    // Response shape: { data: { items: SystemDTO[] } }
  }

  const { options, optionsMap, loading, run } = useOptions(searchSystems, {
    listPath: 'data.items',
    labelPath: 'name',
    valuePath: 'id',
    manual: true,
    defaultData: { data: { items: [] } },
  })

  // Quickly look up an option by its value
  const selectedOption = optionsMap['42']

  return (
    <div>
      <input
        placeholder="Search systems..."
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

### params

| Property | Description                          | Type                              | Default |
| -------- | ------------------------------------ | --------------------------------- | ------- |
| api      | The async function to execute        | `Service<TData, TParams>`         | `-`     |
| config   | Configuration for extraction + query | `UseOptionsConfig<TParams, TData>` | `-`     |

#### UseOptionsConfig

| Property | Description                                      | Type      | Default |
| -------- | ------------------------------------------------ | --------- | ------- |
| listPath | Dot-separated path to the array in the response  | `string`  | `-`     |
| labelPath | Field path to use as `option.label`             | `string`  | `-`     |
| valuePath | Field path to use as `option.value`             | `string`  | `-`     |

Inherits all options from `UseQueryOptions`:

| Property      | Description                             | Type      | Default     |
| ------------- | --------------------------------------- | --------- | ----------- |
| manual        | Whether to manually trigger the request | `boolean` | `false`     |
| defaultParams | Default parameters for the API call     | `TParams` | `{}`        |
| defaultData   | Default data value                      | `TData`   | `undefined` |

### return

| Property    | Description                                  | Type                                          |
| ----------- | -------------------------------------------- | --------------------------------------------- |
| data        | The raw response data from the API           | `TData`                                       |
| loading     | Whether the request is in progress           | `boolean`                                     |
| error       | Error object if the request failed           | `Error \| null`                               |
| run         | Function to manually trigger the request     | `(params?: TParams) => Promise<void>`         |
| params      | Current parameters used for the request      | `TParams`                                     |
| options     | Normalized array of `{ label, value }` items | `OptionItem[]`                                |
| optionsMap  | Key-value map keyed by option value          | `Record<string, OptionItem>`                  |

#### OptionItem

| Property | Description             | Type     |
| -------- | ----------------------- | -------- |
| label    | Display text for the option | `string` |
| value    | Unique identifier for the option | `string` |
