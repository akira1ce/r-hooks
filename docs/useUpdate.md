# useUpdate

强制更新 hook，用于手动触发组件重新渲染。

## 用法

```typescript
import { useUpdate } from 'r-hooks';

function MyComponent() {
  const update = useUpdate();
  
  const handleForceUpdate = () => {
    // 触发组件重新渲染
    update();
  };

  return (
    <div>
      <span>当前时间: {new Date().toLocaleTimeString()}</span>
      <button onClick={handleForceUpdate}>强制更新</button>
    </div>
  );
}
```

## 入参类型

```typescript
function useUpdate(): () => void
```

无参数。

## 返回类型

```typescript
() => void
```

返回一个无参数的函数，调用时触发组件重新渲染。