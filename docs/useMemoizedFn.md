# useMemoizedFn

记忆化函数 hook，确保函数引用稳定的同时保持函数逻辑始终最新。

## 用法

```tsx
import { useMemoizedFn } from 'r-hooks';

function MyComponent({ onUpdate, data }) {
  // 不需要依赖数组，函数引用永远稳定，但内部逻辑始终最新
  const handleClick = useMemoizedFn(() => {
    onUpdate(data.id); // 总是使用最新的 onUpdate 和 data
  });

  // 与 useCallback 对比
  // const handleClick = useCallback(() => {
  //   onUpdate(data.id); // 需要添加 onUpdate 和 data 到依赖数组
  // }, [onUpdate, data]);

  return (
    <ExpensiveChildComponent onClick={handleClick} />
  );
}

// 子组件不会因为父组件的重新渲染而重新渲染
const ExpensiveChildComponent = React.memo(({ onClick }) => {
  console.log('Child rendered'); // 只会在首次渲染时输出
  return <button onClick={onClick}>Click me</button>;
});
```

## 入参类型

```typescript
type Noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends Noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends Noop>(fn: T): PickFunction<T>
```

### 参数

| 参数 | 类型             | 描述             |
| ---- | ---------------- | ---------------- |
| fn   | `T extends Noop` | 需要记忆化的函数 |

## 返回类型

```typescript
PickFunction<T>
```

返回一个与原函数签名相同的稳定函数引用，该函数会调用最新版本的原函数。