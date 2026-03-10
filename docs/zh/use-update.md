# useUpdate

一个提供强制组件重新渲染函数的 React Hook。

## 用法

```typescript
import { useUpdate } from 'r-hooks'

const MyComponent = () => {
  const update = useUpdate()

  const handleForceUpdate = () => {
    // 强制组件重新渲染
    update()
  }

  return <button onClick={handleForceUpdate}>强制更新</button>
}
```

## Api

### 参数

无

### 返回值

| 属性   | 说明                   | 类型         |
| ------ | ---------------------- | ------------ |
| update | 触发组件重新渲染的函数 | `() => void` |
