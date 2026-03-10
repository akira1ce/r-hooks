# useControl

一个用于组件受控状态管理的 React Hook，同时支持受控和非受控组件模式。

## 用法

```typescript
import { useControl } from 'r-hooks'

// 自定义输入组件
const CustomInput = (props) => {
  const [value, setValue] = useControl(props, {
    defaultValue: '',
    valuePropName: 'value',
    target: 'onChange'
  })

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="请输入..."
    />
  )
}

// 作为受控组件使用
const ControlledExample = () => {
  const [inputValue, setInputValue] = useState('controlled')

  return (
    <CustomInput
      value={inputValue}
      onChange={setInputValue}
    />
  )
}

// 作为非受控组件使用
const UncontrolledExample = () => {
  return <CustomInput />
}

// 自定义属性名的组件
const CustomSelect = (props) => {
  const [selected, setSelected] = useControl(props, {
    defaultValue: null,
    valuePropName: 'selectedValue',
    target: 'onSelectionChange'
  })

  return (
    <select
      value={selected || ''}
      onChange={(e) => setSelected(e.target.value)}
    >
      <option value="">请选择...</option>
      <option value="option1">选项 1</option>
      <option value="option2">选项 2</option>
    </select>
  )
}
```

## Api

### 参数

| 属性    | 说明                               | 类型                   | 默认值 |
| ------- | ---------------------------------- | ---------------------- | ------ |
| props   | 可能包含 value 和 onChange 的组件属性 | `UseControllProps<T>`  | `-`    |
| options | 可选配置                           | `UseControlOptions<T>` | `{}`   |

#### UseControlOptions

| 属性          | 说明                   | 类型     | 默认值       |
| ------------- | ---------------------- | -------- | ------------ |
| defaultValue  | 非受控模式下的默认值   | `T`      | `undefined`  |
| valuePropName | value 属性名           | `string` | `'value'`    |
| target        | 变更回调属性名         | `string` | `'onChange'` |

#### UseControllProps

| 属性          | 说明           | 类型                 | 默认值      |
| ------------- | -------------- | -------------------- | ----------- |
| value         | 受控值         | `T`                  | `undefined` |
| onChange      | 变更回调函数   | `(value: T) => void` | `undefined` |
| [key: string] | 其他属性       | `any`                | `-`         |

### 返回值

| 属性     | 说明                           | 类型                 |
| -------- | ------------------------------ | -------------------- |
| value    | 当前值（受控或内部状态）       | `T`                  |
| setValue | 更新值的函数                   | `(value: T) => void` |
