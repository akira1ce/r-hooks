# useClickAway

A React hook that detects clicks outside of a target element and executes a handler function.

## usage

```typescript
import { useClickAway } from 'r-hooks'

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const modalRef = useRef(null)

  useClickAway(modalRef, () => {
    setIsOpen(false)
  })

  if (!isOpen) return null

  return (
    <div ref={modalRef} className="modal">
      <p>Click outside to close</p>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|target|The DOM target element to monitor|`DomTarget`|`-`|
|handler|Function to execute when clicking outside|`(e: MouseEvent) => void`|`-`|

### return

None