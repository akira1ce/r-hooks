# useInterval

A React hook for creating and managing intervals with automatic cleanup.

## usage

```typescript
import { useInterval } from 'r-hooks'

const Timer = () => {
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState(1000)

  // Run every second
  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  // Dynamic delay
  useInterval(() => {
    console.log('Dynamic interval', count)
  }, delay)

  // Pause interval by setting delay to null
  useInterval(() => {
    console.log('This will not run')
  }, null)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setDelay(delay === 1000 ? 500 : 1000)}>
        Toggle Speed
      </button>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|cb|Callback function to execute on each interval|`() => void`|`-`|
|delay|Delay in milliseconds (null to pause)|`number | null`|`-`|

### return

None