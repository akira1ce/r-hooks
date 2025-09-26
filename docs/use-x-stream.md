# useXStream

A React hook for handling server-sent events (SSE) and streaming data with cancellation support.

## usage

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
        {loading ? 'Streaming...' : 'Start Stream'}
      </button>
      <button onClick={cancel}>Cancel</button>

      {error && <p>Error: {error.message}</p>}
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|fetcher|Function that returns a streaming response|`Fetcher`|`-`|
|options|Optional configuration|`UseXStreamOptions`|`{}`|

#### UseXStreamOptions

|Property|Description|Type|Default|
|---|---|---|---|
|transform|Function to transform each chunk|`(value: string) => string`|`undefined`|

#### Fetcher Type

```typescript
type Fetcher = (params: any, signal?: AbortSignal) => Promise<Response>
```

### return

|Property|Description|Type|
|---|---|---|
|content|The accumulated streamed content|`string`|
|loading|Whether the stream is currently active|`boolean`|
|error|Any error that occurred during streaming|`Error | null`|
|run|Function to start streaming with params|`(params: any) => void`|
|cancel|Function to cancel the current stream|`() => void`|