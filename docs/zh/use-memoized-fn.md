# useMemoizedFn

一个记忆化函数的 React Hook，保持引用稳定的同时始终使用最新的函数行为。

## 用法

```typescript
import { useMemoizedFn } from 'r-hooks'

const MyComponent = () => {
  const [count, setCount] = useState(0)

  const handleClick = useMemoizedFn(() => {
    console.log('当前计数:', count)
  })

  // handleClick 的引用在渲染之间保持不变
  // 但始终使用最新的 count 值

  return <button onClick={handleClick}>点击我</button>
}
```

## Api

### 参数

| 属性 | 说明             | 类型             | 默认值 |
| ---- | ---------------- | ---------------- | ------ |
| fn   | 需要记忆化的函数 | `T extends Noop` | `-`    |

### 返回值

| 属性       | 说明                     | 类型              |
| ---------- | ------------------------ | ----------------- |
| memoizedFn | 引用稳定的记忆化函数     | `PickFunction<T>` |
