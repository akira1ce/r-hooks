# use

A React hook that mocks the React 18 `use` method for handling promises with status tracking.

## usage

```typescript
import { use } from 'r-hooks'

const MyComponent = () => {
  const promise = fetchData() // Your promise
  const data = use(promise)

  return <div>{data}</div>
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|promise|A promise with optional status tracking|`PromiseWithStatus<T>`|`-`|

### return

|Property|Description|Type|
|---|---|---|
|data|The resolved data from the promise|`T`|
