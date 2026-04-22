# useClickAway

一个检测目标元素外部点击并执行回调函数的 React Hook。

## 用法

```typescript
import { useClickAway } from 'r-hooks'

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const modalRef = useRef(null)

  useClickAway(modalRef, () => {
    setIsOpen(false)
  })

  if (!isOpen) return null

  return (
    <div ref={modalRef} className="modal">
      <p>点击外部关闭</p>
    </div>
  )
}
```

## Api

### 参数

| 属性    | 说明                     | 类型                      | 默认值 |
| ------- | ------------------------ | ------------------------- | ------ |
| target  | 要监听的 DOM 目标元素    | `DomTarget`               | `-`    |
| handler | 点击外部时执行的回调函数 | `(e: MouseEvent) => void` | `-`    |

### 返回值

无
