# useLeast

保持最新值的 hook，用于在组件重新渲染时获取最新的值。

## 功能

提供一个简单的方式来保持和获取最新的值，确保在任何时候都能访问到最新的状态或 props。

## 用法

```tsx
import { useLeast } from 'r-hooks';

function MyComponent({ count, onUpdate }) {
  const latestCount = useLeast(count);
  const latestOnUpdate = useLeast(onUpdate);

  const handleAsyncOperation = async () => {
    // 在异步操作中使用最新值
    setTimeout(() => {
      console.log('Latest count:', latestCount); // 总是最新的 count 值
      latestOnUpdate(latestCount + 1); // 总是最新的 onUpdate 函数
    }, 1000);
  };

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={handleAsyncOperation}>Async Update</button>
    </div>
  );
}
```

## 入参类型

```typescript
function useLeast<T>(value: T): T
```

### 参数

| 参数  | 类型 | 描述             |
| ----- | ---- | ---------------- |
| value | `T`  | 需要保持最新的值 |

## 返回类型

```typescript
T
```

### 返回值

返回传入的最新值，类型与输入值相同。