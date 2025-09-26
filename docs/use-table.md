# useTable

A React hook for handling table data requests with enhanced error handling, type safety, and parameter management.

## usage

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
    return response.json() // Should return { list: User[], total: number }
  }

  const { data, loading, total, run, params } = useTable(fetchUsers, {
    defaultParams: { page: 1, pageSize: 10 },
    manual: false // Auto-fetch on mount
  })

  const handleSearch = (search: string) => {
    run({ search, page: 1 }) // Reset to page 1 when searching
  }

  const handlePageChange = (page: number) => {
    run({ page })
  }

  return (
    <div>
      <input
        placeholder="Search users..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
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
        <p>Total: {total} users</p>
        <p>Current Page: {params.page}</p>
        <button onClick={() => handlePageChange(params.page - 1)} disabled={params.page === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(params.page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

// Manual mode example
const ManualTableExample = () => {
  const { data, loading, run } = useTable(fetchUsers, {
    defaultParams: { page: 1, pageSize: 10 },
    manual: true // Don't auto-fetch
  })

  return (
    <div>
      <button onClick={() => run()}>Load Data</button>
      {/* Rest of component */}
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|api|API function that returns table data|`UseTableApi<T, K>`|`-`|
|options|Optional configuration|`UseTableOptions<T>`|`{}`|

#### UseTableOptions

|Property|Description|Type|Default|
|---|---|---|---|
|defaultParams|Default parameters for API calls|`T`|`undefined`|
|manual|Whether to manually trigger requests|`boolean`|`false`|

#### UseTableApi Type

```typescript
type UseTableApi<T, K> = (params: T) => Promise<UseTableResponse<K>>
```

#### UseTableResponse Interface

|Property|Description|Type|Default|
|---|---|---|---|
|total|Total number of records|`number`|`-`|
|list|Array of table data|`K[]`|`-`|
|[key: string]|Any other response properties|`unknown`|`-`|

### return

|Property|Description|Type|
|---|---|---|
|data|The table data array|`K[]`|
|loading|Whether a request is in progress|`boolean`|
|total|Total number of records|`number`|
|run|Function to trigger API call with partial params|`(params: Partial<T>) => Promise<void>`|
|params|Current parameters being used|`T`|