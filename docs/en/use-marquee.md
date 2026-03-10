# useMarquee

A React hook that provides marquee (scrolling) functionality with smooth animation, auto-play support, and manual control.

## usage

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

### params

| Property     | Description              | Type      | Default |
| ------------ | ------------------------ | --------- | ------- |
| deps         | Dependency list          | `any[]`   | `[]`    |
| autoPlay     | Enable auto-play         | `boolean` | `false` |
| autoPlayStep | Auto-play step per frame | `number`  | `0.3`   |

### return

| Property | Description                        | Type                              |
| -------- | ---------------------------------- | --------------------------------- |
| trackRef | Ref for the scroll track container | `React.RefObject<HTMLDivElement>` |
| next     | Scroll forward by a given step     | `(step: number) => void`          |
| prev     | Scroll backward by a given step    | `(step: number) => void`          |
| pause    | Pause auto-play                    | `() => void`                      |
| resume   | Resume auto-play                   | `() => void`                      |

### notice

`trackRef` should point to the scroll track container, which must contain a single list element wrapping the items: `trackRef -> list -> items`.
