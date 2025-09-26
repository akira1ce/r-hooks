# useMos

A React hook that tracks mouse position and provides comprehensive mouse event data including element-relative coordinates and dimensions.

## usage

```typescript
import { useMos } from 'r-hooks'

const MouseTracker = () => {
  const containerRef = useRef(null)
  const mos = useMos(containerRef)

  return (
    <div ref={containerRef} style={{ width: 300, height: 200, border: '1px solid #ccc' }}>
      <p>Mouse X (relative to element): {mos.elementX}</p>
      <p>Mouse Y (relative to element): {mos.elementY}</p>
      <p>Element Width: {mos.elementW}</p>
      <p>Element Height: {mos.elementH}</p>
      <p>Page X: {mos.pageX}</p>
      <p>Page Y: {mos.pageY}</p>
    </div>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|target|The DOM target element to track mouse on|`DomTarget<HTMLDivElement>`|`undefined`|

### return

|Property|Description|Type|
|---|---|---|
|mousePosition|Comprehensive mouse position data|`MousePosition`|

#### MousePosition Interface

|Property|Description|Type|
|---|---|---|
|clientX|Mouse X coordinate relative to the viewport|`number`|
|clientY|Mouse Y coordinate relative to the viewport|`number`|
|pageX|Mouse X coordinate relative to the document|`number`|
|pageY|Mouse Y coordinate relative to the document|`number`|
|screenX|Mouse X coordinate relative to the screen|`number`|
|screenY|Mouse Y coordinate relative to the screen|`number`|
|elementX|Mouse X coordinate relative to the target element|`number`|
|elementY|Mouse Y coordinate relative to the target element|`number`|
|elementW|Width of the target element|`number`|
|elementH|Height of the target element|`number`|
|elementPosX|X position of the target element relative to the document|`number`|
|elementPosY|Y position of the target element relative to the document|`number`|