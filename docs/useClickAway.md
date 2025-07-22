# useClickAway

监听目标元素外部的点击事件，常用于弹窗、下拉菜单等场景，点击元素外部时触发回调。

## 用法

```typescript
import { useClickAway } from 'r-hooks';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, (e) => {
    // 这里处理点击外部的逻辑
    alert('点击了外部区域');
  });

  return <div ref={ref}>点击外部试试</div>;
}
```

## 入参类型

```typescript
function useClickAway<T extends HTMLElement>(
  elementRef: RefObject<T>,
  handler: (e: Event) => void
): void
```

- `elementRef`: 目标元素的 ref。
- `handler`: 当点击发生在元素外部时触发的回调。

## 返回类型

```typescript
void
```

无返回值。 