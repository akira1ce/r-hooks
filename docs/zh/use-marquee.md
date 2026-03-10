# useMarquee

一个提供跑马灯（滚动）功能的 React Hook，支持平滑动画、自动播放和手动控制。

## 用法

```typescript
import { useMarquee } from './hooks/use-marquee';

const btnCls = '';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Index = () => {
  const { trackRef, next, prev, pause, resume } = useMarquee({
    autoPlay: true,
    autoPlayStep: 0.3,
  });

  return (
    <div className="w-full overflow-hidden">
      <div ref={trackRef} className="flex whitespace-nowrap">
        <div className="flex">
          {items.map((item) => (
            <span key={item} className="px-4">
              Item {item}
            </span>
          ))}
        </div>
        <div className="flex">
          {items.map((item) => (
            <span key={item} className="px-4">
              Item {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className={btnCls} onClick={() => prev(100)}>
          Prev
        </div>
        <div className={btnCls} onClick={() => next(100)}>
          Next
        </div>
        <div className={btnCls} onClick={pause}>
          Pause
        </div>
        <div className={btnCls} onClick={resume}>
          Resume
        </div>
      </div>
    </div>
  );
};

export default Index;
```

## Api

### 参数

| 属性         | 说明             | 类型      | 默认值  |
| ------------ | ---------------- | --------- | ------- |
| deps         | 依赖列表         | `any[]`   | `[]`    |
| autoPlay     | 是否自动播放     | `boolean` | `false` |
| autoPlayStep | 自动播放每帧步长 | `number`  | `0.3`   |

### 返回值

| 属性     | 说明               | 类型                              |
| -------- | ------------------ | --------------------------------- |
| trackRef | 滚动轨道容器的 Ref | `React.RefObject<HTMLDivElement>` |
| next     | 向前滚动指定步长   | `(step: number) => void`          |
| prev     | 向后滚动指定步长   | `(step: number) => void`          |
| pause    | 暂停自动播放       | `() => void`                      |
| resume   | 恢复自动播放       | `() => void`                      |

### 注意

`trackRef` 指向滚动轨道容器，其内部需要包裹一个列表容器：`trackRef -> list -> items`。
