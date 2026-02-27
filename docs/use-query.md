# useQuery

A React hook for managing asynchronous data fetching with loading states, error handling, and manual trigger support.

## usage

```typescript
import { useQuery } from 'r-hooks'

// Basic usage with automatic trigger
const UserProfile = () => {
  const fetchUser = async (params?: { id: string }) => {
    const response = await fetch(`/api/user/${params?.id}`)
    return response.json()
  }

  const { data, loading, error, run } = useQuery(fetchUser, {
    defaultParams: { id: '123' },
    defaultData: null
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data?.name}</div>
}

// Manual trigger mode
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
        Search
      </button>
      {data.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  )
}
```

## Api

### params

| Property | Description                   | Type                              | Default |
| -------- | ----------------------------- | --------------------------------- | ------- |
| api      | The async function to execute | `Service<TData, TParams>`         | `-`     |
| options  | Optional configuration        | `UseQueryOptions<TParams, TData>` | `{}`    |

#### UseQueryOptions

| Property      | Description                             | Type      | Default     |
| ------------- | --------------------------------------- | --------- | ----------- |
| manual        | Whether to manually trigger the request | `boolean` | `false`     |
| defaultParams | Default parameters for the API call     | `TParams` | `{}`        |
| defaultData   | Default data value                      | `TData`   | `undefined` |

#### Service

| Property | Description                       | Type                                   |
| -------- | --------------------------------- | -------------------------------------- |
| Service  | Async function type for API calls | `(params?: TParams) => Promise<TData>` |

### return

| Property | Description                              | Type                                  |
| -------- | ---------------------------------------- | ------------------------------------- |
| data     | The response data from the API           | `TData`                               |
| loading  | Whether the request is in progress       | `boolean`                             |
| error    | Error object if the request failed       | `Error \| null`                       |
| run      | Function to manually trigger the request | `(params?: TParams) => Promise<void>` |
| params   | Current parameters used for the request  | `TParams`                             |
