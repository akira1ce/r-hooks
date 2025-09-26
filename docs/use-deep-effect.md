# useDeepEffect

A React hook similar to useEffect but with deep comparison of dependencies instead of shallow comparison.

## usage

```typescript
import { useDeepEffect } from 'r-hooks'

const DeepEffectComponent = () => {
  const [user, setUser] = useState({ name: 'John', age: 25 })
  const [config, setConfig] = useState({ theme: 'dark', lang: 'en' })

  // This effect only runs when user or config objects actually change deeply
  useDeepEffect(() => {
    console.log('User or config changed:', { user, config })

    return () => {
      console.log('Cleanup function')
    }
  }, [user, config])

  return (
    <div>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        Increase Age
      </button>
      <button onClick={() => setUser({ name: 'John', age: 25 })}>
        Reset User (no deep change)
      </button>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|fn|Effect function that returns cleanup function|`() => () => void`|`-`|
|deps|Dependency array for deep comparison|`any[]`|`-`|

### return

None