# useControl

组件受控状态管理 hook，用于实现组件的受控和非受控模式。

## 用法

```tsx
import { useControl } from 'r-hooks';

interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function CustomInput(props: InputProps) {
  const [value, setValue] = useControl(props, {
    defaultValue: '',
    valuePropName: 'value',
    target: 'onChange'
  });

  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// 受控模式
<CustomInput value={controlledValue} onChange={setControlledValue} />

// 非受控模式
<CustomInput defaultValue="初始值" />
```

## 入参类型

```typescript
export interface UseControlOptions<T> {
  /** 默认值 */
  defaultValue?: T;
  /** 值的字段 */
  valuePropName?: string;
  /** 改变回调的字段 */
  target?: string;
}

export interface UseControllProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  [key: string]: any;
}

function useControl<T>(
  props: UseControllProps<T>, 
  options?: UseControlOptions<T>
): readonly [T, (v: T) => void]
```

### 参数

| 参数    | 类型                   | 描述              |
| ------- | ---------------------- | ----------------- |
| props   | `UseControllProps<T>`  | 组件的 props 对象 |
| options | `UseControlOptions<T>` | 配置选项          |

### Options 配置

| 属性          | 类型     | 默认值           | 描述             |
| ------------- | -------- | ---------------- | ---------------- |
| defaultValue  | `T`      | `'defaultValue'` | 默认值           |
| valuePropName | `string` | `'value'`        | 值的属性名       |
| target        | `string` | `'onChange'`     | 回调函数的属性名 |

## 返回类型

```typescript
readonly [T, (v: T) => void]
```

### 返回值

| 索引 | 类型             | 描述         |
| ---- | ---------------- | ------------ |
| 0    | `T`              | 当前值       |
| 1    | `(v: T) => void` | 更新值的函数 |