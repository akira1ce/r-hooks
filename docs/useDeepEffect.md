# useDeepEffect

深度比较依赖的 useEffect hook，用法与 useEffect 相同但支持对象和数组的深度比较。

## 功能

提供与 `useEffect` 相同的 API，但使用深度比较来检测依赖项的变化，避免因对象或数组引用变化而导致的不必要重新执行。

## 用法

```tsx
import { useDeepEffect } from 'r-hooks';

function MyComponent({ user, settings }) {
  // 使用深度比较，只有当 user 或 settings 的内容真正变化时才重新执行
  useDeepEffect(() => {
    console.log('User or settings changed');
    
    return () => {
      console.log('Cleanup');
    };
  }, [user, settings]);

  // 对比普通的 useEffect，每次 render 都会执行（如果 user/settings 是新对象）
  // useEffect(() => {
  //   console.log('This will run on every render if user/settings are new objects');
  // }, [user, settings]);

  return <div>...</div>;
}
```

## 入参类型

```typescript
function useDeepEffect(
  fn: () => () => void, 
  deps: any[]
): void
```

### 参数

| 参数 | 类型               | 描述                             |
| ---- | ------------------ | -------------------------------- |
| fn   | `() => () => void` | 副作用函数，可以返回清理函数     |
| deps | `any[]`            | 依赖数组，支持任意类型的深度比较 |

## 返回类型

```typescript
void
```