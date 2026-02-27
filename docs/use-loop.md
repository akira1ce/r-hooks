# useLoop

A React hook that provides polling functionality with configurable interval, retry mechanism, and manual start/stop control.

## usage

```typescript
import { useLoop } from 'r-hooks'

// Polling with automatic retry
const DataMonitor = () => {
  const [status, setStatus] = useState('idle')

  const checkStatus = async () => {
    const response = await fetch('/api/status')
    const data = await response.json()
    setStatus(data.status)

    if (data.status === 'completed') {
      throw new Error('Polling completed')
    }
  }

  const { start, stop, isRunning } = useLoop(checkStatus, {
    pollingInterval: 2000,
    pollingRetryCount: 5
  })

  return (
    <div>
      <p>Status: {status}</p>
      <p>Polling: {isRunning ? 'Running' : 'Stopped'}</p>
      <button onClick={start} disabled={isRunning}>
        Start Polling
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop Polling
      </button>
    </div>
  )
}

// Auto-start polling on mount
const AutoPollingComponent = () => {
  const { start, stop } = useLoop(async () => {
    console.log('Polling...')
    await fetch('/api/check')
  }, {
    pollingInterval: 1000,
    pollingRetryCount: 10
  })

  useEffect(() => {
    start()
    return () => stop()
  }, [])

  return <div>Auto polling component</div>
}
```

## Api

### params

| Property | Description                               | Type                          | Default |
| -------- | ----------------------------------------- | ----------------------------- | ------- |
| cb       | Callback function to execute on each poll | `() => void \| Promise<void>` | `-`     |
| options  | Polling configuration                     | `UseLoopOptions`              | `-`     |

#### UseLoopOptions

| Property          | Description                                            | Type     | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| pollingInterval   | Interval between polling attempts in milliseconds      | `number` | `1000`  |
| pollingRetryCount | Maximum number of consecutive failures before stopping | `number` | `10`    |

### return

| Property  | Description                                   | Type         |
| --------- | --------------------------------------------- | ------------ |
| start     | Function to start the polling loop            | `() => void` |
| stop      | Function to stop the polling loop             | `() => void` |
| isRunning | Whether the polling loop is currently running | `boolean`    |
