# useLockBodyScroll

A React hook that locks or unlocks body scrolling by controlling the overflow style.

## usage

```typescript
import { useLockBodyScroll } from 'r-hooks'

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll when modal is open
  useLockBodyScroll(isOpen)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  )
}
```

## Api

### params

| Property | Description                          | Type      | Default |
| -------- | ------------------------------------ | --------- | ------- |
| lock     | Whether to lock body scroll          | `boolean` | `-`     |

### return

None
