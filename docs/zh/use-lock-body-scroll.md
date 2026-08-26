# useLockBodyScroll

一个 React Hook，通过控制 overflow 样式来锁定或解锁 body 滚动。

## 使用

```typescript
import { useLockBodyScroll } from 'r-hooks'

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)

  // 当模态框打开时锁定 body 滚动
  useLockBodyScroll(isOpen)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开模态框</button>
      {isOpen && (
        <div className="modal">
          <p>模态框内容</p>
          <button onClick={() => setIsOpen(false)}>关闭</button>
        </div>
      )}
    </>
  )
}
```

## Api

### 参数

| 属性 | 说明               | 类型      | 默认值 |
| ---- | ------------------ | --------- | ------ |
| lock | 是否锁定 body 滚动 | `boolean` | `-`    |

### 返回值

无
