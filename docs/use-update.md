# useUpdate

A React hook that provides a function to force component re-renders.

## usage

```typescript
import { useUpdate } from 'r-hooks'

const MyComponent = () => {
  const update = useUpdate()

  const handleForceUpdate = () => {
    // Force component to re-render
    update()
  }

  return <button onClick={handleForceUpdate}>Force Update</button>
}
```

## Api

### params

None

### return

|Property|Description|Type|
|---|---|---|
|update|Function to trigger component re-render|`() => void`|
