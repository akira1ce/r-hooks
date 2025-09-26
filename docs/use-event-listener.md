# useEventListener

A React hook for adding event listeners to HTMLElement, Document, or Window with automatic cleanup.

## usage

```typescript
import { useEventListener } from 'r-hooks'

const KeyboardHandler = () => {
  // Listen to window events
  useEventListener('keydown', (event) => {
    console.log('Key pressed:', event.key)
  })

  // Listen to element events
  const buttonRef = useRef(null)
  useEventListener('click', (event) => {
    console.log('Button clicked')
  }, { target: buttonRef })

  return <button ref={buttonRef}>Click me</button>
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|eventName|The event name to listen for|`string`|`-`|
|handler|The event handler function|`(event: any) => void`|`-`|
|options|Optional configuration|`UseEventListenerOptions`|`{}`|

#### UseEventListenerOptions

|Property|Description|Type|Default|
|---|---|---|---|
|target|The target to attach the event listener to|`DomTarget<T>`|`window`|

### return

None