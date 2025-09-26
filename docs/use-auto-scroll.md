# useAutoScroll

A React hook that provides auto-scroll functionality with scroll position tracking and manual control.

## usage

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
        <button onClick={scrollToBottom}>Scroll to bottom</button>
      )}
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|target|The DOM target element to apply auto-scroll|`DomTarget`|`-`|
|deps|Dependency list to trigger auto-scroll|`DependencyList`|`[]`|

### return

|Property|Description|Type|
|---|---|---|
|handleScroll|Scroll event handler function|`(e: React.UIEvent<HTMLDivElement>) => void`|
|scrollToBottom|Function to manually scroll to bottom|`() => void`|
|enableAutoScroll|Whether auto-scroll is currently enabled|`boolean`|