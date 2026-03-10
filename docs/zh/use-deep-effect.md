# useDeepEffect

一个类似 useEffect 的 React Hook，使用深比较代替浅比较来判断依赖是否变化。

## 用法

```typescript
import { useDeepEffect } from 'r-hooks'

const DeepEffectComponent = () => {
  const [user, setUser] = useState({ name: 'John', age: 25 })
  const [config, setConfig] = useState({ theme: 'dark', lang: 'en' })

  // 仅在 user 或 config 对象的值真正发生深层变化时触发
  useDeepEffect(() => {
    console.log('User or config changed:', { user, config })

    return () => {
      console.log('Cleanup function')
    }
  }, [user, config])

  return (
    <div>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        增加年龄
      </button>
      <button onClick={() => setUser({ name: 'John', age: 25 })}>
        重置用户（无深层变化）
      </button>
    </div>
  )
}
```

## Api

### 参数

| 属性 | 说明                     | 类型               | 默认值 |
| ---- | ------------------------ | ------------------ | ------ |
| fn   | 副作用函数，可返回清理函数 | `() => () => void` | `-`    |
| deps | 用于深比较的依赖数组     | `any[]`            | `-`    |

### 返回值

无
