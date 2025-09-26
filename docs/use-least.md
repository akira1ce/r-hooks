# useLeast

A React hook that keeps the latest value in a ref, ensuring you always have access to the most current value.

## usage

```typescript
import { useLeast } from 'r-hooks'

const MyComponent = () => {
  const [count, setCount] = useState(0)
  const latestCount = useLeast(count)

  const handleClick = () => {
    // latestCount always refers to the current value
    console.log(latestCount) // Current count value
  }

  return <button onClick={handleClick}>Count: {count}</button>
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|value|The value to keep the latest reference of|`T`|`-`|

### return

|Property|Description|Type|
|---|---|---|
|latestValue|The latest value|`T`|
