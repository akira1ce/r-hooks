# useEventListener

为指定元素或全局对象添加事件监听，自动解绑，支持自定义 target。

## 用法

```typescript
import { useEventListener } from 'r-hooks';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEventListener('click', (e) => {
    // 处理点击事件
    console.log('clicked', e);
  }, { target: ref });

  // 监听 window 的 resize 事件
  useEventListener('resize', () => {
    console.log('window resized');
  });

  return <div ref={ref}>监听事件</div>;
}
```

## 入参类型

```typescript
interface UseEventListenerOptions<T> {
  target?: RefObject<T>;
}

function useEventListener<T extends HTMLElement = HTMLElement>(
  eventName: keyof HTMLElementEventMap,
  handler: (event: Event) => void,
  options?: UseEventListenerOptions<T>
): void
```

- `eventName`: 事件名，如 'click'。
- `handler`: 事件回调函数。
- `options`: 可选，包含 target（ref）。

## 返回类型

```typescript
void
```

无返回值。 