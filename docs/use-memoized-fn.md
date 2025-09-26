# useMemoizedFn

A React hook that memoizes a function to maintain referential equality while keeping the latest function behavior.

## usage

```typescript
import { useMemoizedFn } from 'r-hooks'

const MyComponent = () => {
  const [count, setCount] = useState(0)

  const handleClick = useMemoizedFn(() => {
    console.log('Current count:', count)
  })

  // handleClick reference stays the same across renders
  // but always uses the latest count value

  return <button onClick={handleClick}>Click me</button>
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|fn|The function to memoize|`T extends Noop`|`-`|

### return

|Property|Description|Type|
|---|---|---|
|memoizedFn|The memoized function with stable reference|`PickFunction<T>`|
