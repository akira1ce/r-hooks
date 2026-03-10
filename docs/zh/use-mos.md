# useMos

一个追踪鼠标位置的 React Hook，提供全面的鼠标事件数据，包括相对于元素的坐标和尺寸信息。

## 用法

```typescript
import { useMos } from 'r-hooks'

const MouseTracker = () => {
  const containerRef = useRef(null)
  const mos = useMos(containerRef)

  return (
    <div ref={containerRef} style={{ width: 300, height: 200, border: '1px solid #ccc' }}>
      <p>鼠标 X（相对于元素）: {mos.elementX}</p>
      <p>鼠标 Y（相对于元素）: {mos.elementY}</p>
      <p>元素宽度: {mos.elementW}</p>
      <p>元素高度: {mos.elementH}</p>
      <p>页面 X: {mos.pageX}</p>
      <p>页面 Y: {mos.pageY}</p>
    </div>
  )
}
```

## Api

### 参数

| 属性   | 说明                     | 类型                        | 默认值      |
| ------ | ------------------------ | --------------------------- | ----------- |
| target | 要追踪鼠标的 DOM 目标元素 | `DomTarget<HTMLDivElement>` | `undefined` |

### 返回值

| 属性          | 说明             | 类型            |
| ------------- | ---------------- | --------------- |
| mousePosition | 全面的鼠标位置数据 | `MousePosition` |

#### MousePosition 接口

| 属性        | 说明                       | 类型     |
| ----------- | -------------------------- | -------- |
| clientX     | 鼠标相对于视口的 X 坐标    | `number` |
| clientY     | 鼠标相对于视口的 Y 坐标    | `number` |
| pageX       | 鼠标相对于文档的 X 坐标    | `number` |
| pageY       | 鼠标相对于文档的 Y 坐标    | `number` |
| screenX     | 鼠标相对于屏幕的 X 坐标    | `number` |
| screenY     | 鼠标相对于屏幕的 Y 坐标    | `number` |
| elementX    | 鼠标相对于目标元素的 X 坐标 | `number` |
| elementY    | 鼠标相对于目标元素的 Y 坐标 | `number` |
| elementW    | 目标元素的宽度             | `number` |
| elementH    | 目标元素的高度             | `number` |
| elementPosX | 目标元素相对于文档的 X 位置 | `number` |
| elementPosY | 目标元素相对于文档的 Y 位置 | `number` |
