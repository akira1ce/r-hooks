# useMos

监听鼠标在指定元素上的移动，返回详细的鼠标位置与元素信息。

## 参数

- `target?: DomTarget<HTMLDivElement>`  
  监听的目标元素，支持 ref、元素、函数等多种写法。可选，默认监听 window。

## 返回值

返回一个对象，包含以下字段：

- `clientX`, `clientY`：鼠标相对于视口的坐标
- `pageX`, `pageY`：鼠标相对于文档的坐标
- `screenX`, `screenY`：鼠标相对于屏幕的坐标
- `elementX`, `elementY`：鼠标相对于目标元素左上角的坐标
- `elementW`, `elementH`：目标元素的宽高
- `elementPosX`, `elementPosY`：目标元素相对于文档的坐标

## 示例

```tsx
import { useRef } from "react";
import { useMos } from "r-hooks";

export function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const mos = useMos(ref);

  return (
    <div ref={ref} style={{ width: 300, height: 200, background: "#eee" }}>
      <pre>{JSON.stringify(mos, null, 2)}</pre>
    </div>
  );
}
```

## 注意事项

- 依赖 DOM，SSR 时请确保只在客户端调用。
- target 未指定时，监听 window。 