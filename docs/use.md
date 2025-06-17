# use

Mock React Hooks `use` method for handling promises with status tracking.

## 功能

模拟 React 18+ 的 `use` hook，用于处理带状态的 Promise 对象。支持 pending、fulfilled、rejected 三种状态的管理。

## 用法

```tsx
import { use } from 'r-hooks';

// 创建带状态的 Promise
const promiseWithStatus: PromiseWithStatus<string> = fetch('/api/data')
  .then(res => res.text()) as PromiseWithStatus<string>;

function MyComponent() {
  const data = use(promiseWithStatus);
  return <div>{data}</div>;
}

// 使用 Suspense 和 Error Boundary 包装组件
function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 入参类型

```typescript
export type PromiseWithStatus<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: any;
};

function use<T>(promise: PromiseWithStatus<T>): T
```

### 参数

| 参数    | 类型                   | 描述                      |
| ------- | ---------------------- | ------------------------- |
| promise | `PromiseWithStatus<T>` | 带状态追踪的 Promise 对象 |

## 返回类型

```typescript
T // Promise resolve 的值
```