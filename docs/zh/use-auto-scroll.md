# useAutoScroll

一个提供自动滚动功能的 React Hook，支持滚动位置追踪和手动控制。

## 用法

```typescript
import { useAutoScroll } from 'r-hooks'

const ChatWindow = () => {
  const [messages, setMessages] = useState([])
  const chatRef = useRef(null)

  const { handleScroll, scrollToBottom, enableAutoScroll } = useAutoScroll(chatRef, [messages])

  return (
    <div ref={chatRef} onScroll={handleScroll} style={{ height: 300, overflow: 'auto' }}>
      {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
      {!enableAutoScroll && (
        <button onClick={scrollToBottom}>滚动到底部</button>
      )}
    </div>
  )
}
```

## Api

### 参数

| 属性   | 说明                        | 类型             | 默认值 |
| ------ | --------------------------- | ---------------- | ------ |
| target | 应用自动滚动的 DOM 目标元素 | `DomTarget`      | `-`    |
| deps   | 触发自动滚动的依赖列表      | `DependencyList` | `[]`   |

### 返回值

| 属性             | 说明                 | 类型                                         |
| ---------------- | -------------------- | -------------------------------------------- |
| handleScroll     | 滚动事件处理函数     | `(e: React.UIEvent<HTMLDivElement>) => void` |
| scrollToBottom   | 手动滚动到底部的函数 | `() => void`                                 |
| enableAutoScroll | 当前是否启用自动滚动 | `boolean`                                    |
