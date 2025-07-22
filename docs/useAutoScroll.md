# useAutoScroll

自动滚动管理 hook，用于实现智能的滚动到底部功能。

## 用法

```tsx
import { useAutoScroll } from 'r-hooks';
import { useRef } from 'react';

function ChatMessages({ messages }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { handleScroll, scrollToBottom, enableAutoScroll } = useAutoScroll(
    scrollRef, 
    [messages] // 当 messages 变化时自动滚动
  );

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ height: '400px', overflow: 'auto' }}
    >
      {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
    </div>
  );
}
```

## 入参类型

```typescript
function useAutoScroll(
  target: RefObject<Element>, 
  deps?: DependencyList
): {
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToBottom: () => void;
  enableAutoScroll: boolean;
}
```

### 参数

| 参数   | 类型                 | 默认值 | 描述                         |
| ------ | -------------------- | ------ | ---------------------------- |
| target | `RefObject<Element>` | -      | 目标滚动容器的 ref           |
| deps   | `DependencyList`     | `[]`   | 依赖数组，变化时触发自动滚动 |

## 返回类型

```typescript
{
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToBottom: () => void;
  enableAutoScroll: boolean;
}
```

### 返回值

| 属性             | 类型                                         | 描述                 |
| ---------------- | -------------------------------------------- | -------------------- |
| handleScroll     | `(e: React.UIEvent<HTMLDivElement>) => void` | 滚动事件处理函数     |
| scrollToBottom   | `() => void`                                 | 手动滚动到底部的函数 |
| enableAutoScroll | `boolean`                                    | 当前是否启用自动滚动 |