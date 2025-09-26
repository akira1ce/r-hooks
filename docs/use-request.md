# useRequest

A React hook for handling API requests with loading states, manual triggering, and polling capabilities.

## usage

```typescript
import { useRequest } from 'r-hooks'

// Basic usage - auto-trigger on mount
const BasicExample = () => {
  const fetchUser = async (id) => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }

  const { data, loading, run } = useRequest(fetchUser)

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>User: {data?.name}</p>}
    </div>
  )
}

// Manual trigger
const ManualExample = () => {
  const { data, loading, run, cancel } = useRequest(fetchUser, {
    manual: true
  })

  return (
    <div>
      <button onClick={() => run(123)} disabled={loading}>
        Fetch User 123
      </button>
      <button onClick={cancel}>Cancel</button>
      {data && <p>User: {data.name}</p>}
    </div>
  )
}

// Polling
const PollingExample = () => {
  const { data, loading, cancel } = useRequest(fetchStatus, {
    pollingInterval: 1000, // Poll every second
    pollingRetryCount: 10  // Stop after 10 attempts
  })

  return (
    <div>
      <p>Status: {data?.status}</p>
      <button onClick={cancel}>Stop Polling</button>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|api|The API service function|`Service<TData, TParams>`|`-`|
|options|Optional configuration|`UseRequestOptions`|`{}`|

#### UseRequestOptions

|Property|Description|Type|Default|
|---|---|---|---|
|manual|Whether to manually trigger the request|`boolean`|`false`|
|pollingInterval|Polling interval in milliseconds|`number`|`undefined`|
|pollingRetryCount|Number of polling retries (-1 for infinite)|`number`|`undefined`|

#### Service Type

```typescript
type Service<TData, TParams> = (params?: TParams) => Promise<TData>
```

### return

|Property|Description|Type|
|---|---|---|
|data|The response data|`TData | undefined`|
|loading|Whether the request is in progress|`boolean`|
|run|Function to manually trigger the request|`(params?: TParams) => Promise<TData | undefined>`|
|cancel|Function to cancel polling|`() => void`|