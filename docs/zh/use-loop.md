# useLoop

一个提供轮询功能的 React Hook，支持可配置的时间间隔、重试机制和手动启停控制。

## 用法

```typescript
import { useLoop } from 'r-hooks'

// 带自动重试的轮询
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
      <p>状态: {status}</p>
      <p>轮询: {isRunning ? '运行中' : '已停止'}</p>
      <button onClick={start} disabled={isRunning}>
        开始轮询
      </button>
      <button onClick={stop} disabled={!isRunning}>
        停止轮询
      </button>
    </div>
  )
}

// 挂载时自动开始轮询
const AutoPollingComponent = () => {
  const { start, stop } = useLoop(async () => {
    console.log('轮询中...')
    await fetch('/api/check')
  }, {
    pollingInterval: 1000,
    pollingRetryCount: 10
  })

  useEffect(() => {
    start()
    return () => stop()
  }, [])

  return <div>自动轮询组件</div>
}
```

## Api

### 参数

| 属性    | 说明                     | 类型                          | 默认值 |
| ------- | ------------------------ | ----------------------------- | ------ |
| cb      | 每次轮询执行的回调函数   | `() => void \| Promise<void>` | `-`    |
| options | 轮询配置                 | `UseLoopOptions`              | `-`    |

#### UseLoopOptions

| 属性              | 说明                           | 类型     | 默认值 |
| ----------------- | ------------------------------ | -------- | ------ |
| pollingInterval   | 轮询间隔时间（毫秒）          | `number` | `1000` |
| pollingRetryCount | 连续失败后停止的最大次数       | `number` | `10`   |

### 返回值

| 属性      | 说明                 | 类型         |
| --------- | -------------------- | ------------ |
| start     | 启动轮询的函数       | `() => void` |
| stop      | 停止轮询的函数       | `() => void` |
| isRunning | 轮询是否正在运行     | `boolean`    |
