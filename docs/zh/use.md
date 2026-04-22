# use

一个模拟 React 18 `use` 方法的 React Hook，用于处理带状态追踪的 Promise。

## 用法

```typescript
import { use } from 'r-hooks'

const MyComponent = () => {
  const promise = fetchData() // 你的 Promise
  const data = use(promise)

  return <div>{data}</div>
}
```

## Api

### 参数

| 属性    | 说明                     | 类型                   | 默认值 |
| ------- | ------------------------ | ---------------------- | ------ |
| promise | 带可选状态追踪的 Promise | `PromiseWithStatus<T>` | `-`    |

### 返回值

| 属性 | 说明                 | 类型 |
| ---- | -------------------- | ---- |
| data | Promise 解析后的数据 | `T`  |
