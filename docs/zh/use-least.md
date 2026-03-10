# useLeast

一个将最新值保持在 ref 中的 React Hook，确保始终可以访问到最新的值。

## 用法

```typescript
import { useLeast } from 'r-hooks'

const MyComponent = () => {
  const [count, setCount] = useState(0)
  const latestCount = useLeast(count)

  const handleClick = () => {
    // latestCount 始终引用当前值
    console.log(latestCount) // 当前 count 值
  }

  return <button onClick={handleClick}>Count: {count}</button>
}
```

## Api

### 参数

| 属性  | 说明                 | 类型 | 默认值 |
| ----- | -------------------- | ---- | ------ |
| value | 需要保持最新引用的值 | `T`  | `-`    |

### 返回值

| 属性        | 说明     | 类型 |
| ----------- | -------- | ---- |
| latestValue | 最新的值 | `T`  |
