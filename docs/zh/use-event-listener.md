# useEventListener

一个为 HTMLElement、Document 或 Window 添加事件监听器的 React Hook，支持自动清理。

## 用法

```typescript
import { useEventListener } from 'r-hooks'

const KeyboardHandler = () => {
  // 监听 window 事件
  useEventListener('keydown', (event) => {
    console.log('按下按键:', event.key)
  })

  // 监听元素事件
  const buttonRef = useRef(null)
  useEventListener('click', (event) => {
    console.log('按钮被点击')
  }, { target: buttonRef })

  return <button ref={buttonRef}>点击我</button>
}
```

## Api

### 参数

| 属性      | 说明             | 类型                      | 默认值 |
| --------- | ---------------- | ------------------------- | ------ |
| eventName | 要监听的事件名称 | `string`                  | `-`    |
| handler   | 事件处理函数     | `(event: any) => void`    | `-`    |
| options   | 可选配置         | `UseEventListenerOptions` | `{}`   |

#### UseEventListenerOptions

| 属性   | 说明                   | 类型           | 默认值   |
| ------ | ---------------------- | -------------- | -------- |
| target | 附加事件监听器的目标   | `DomTarget<T>` | `window` |

### 返回值

无
