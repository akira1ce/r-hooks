# useInterval

一个用于创建和管理定时器的 React Hook，支持自动清理。

## 用法

```typescript
import { useInterval } from 'r-hooks'

const Timer = () => {
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState(1000)

  // 每秒执行一次
  useInterval(() => {
    setCount(count + 1)
  }, 1000)

  // 动态间隔
  useInterval(() => {
    console.log('Dynamic interval', count)
  }, delay)

  // 传入 null 暂停定时器
  useInterval(() => {
    console.log('不会执行')
  }, null)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setDelay(delay === 1000 ? 500 : 1000)}>
        切换速度
      </button>
    </div>
  )
}
```

## Api

### 参数

| 属性  | 说明                                | 类型         | 默认值 |
| ----- | ----------------------------------- | ------------ | ------ | ---- |
| cb    | 每次间隔执行的回调函数              | `() => void` | `-`    |
| delay | 间隔时间（毫秒），传 null 暂停定时器 | `number      | null`  | `-`  |

### 返回值

无
