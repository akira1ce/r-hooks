# useControl

A React hook for component controlled state management, handling both controlled and uncontrolled component patterns.

## usage

```typescript
import { useControl } from 'r-hooks'

// Custom Input Component
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
      placeholder="Type something..."
    />
  )
}

// Usage as controlled component
const ControlledExample = () => {
  const [inputValue, setInputValue] = useState('controlled')

  return (
    <CustomInput
      value={inputValue}
      onChange={setInputValue}
    />
  )
}

// Usage as uncontrolled component
const UncontrolledExample = () => {
  return <CustomInput />
}

// Custom component with different prop names
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
      <option value="">Select...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
    </select>
  )
}
```

## Api

### params

|Property|Description|Type|Default|
|---|---|---|---|
|props|Component props that may contain value and onChange|`UseControllProps<T>`|`-`|
|options|Optional configuration|`UseControlOptions<T>`|`{}`|

#### UseControlOptions

|Property|Description|Type|Default|
|---|---|---|---|
|defaultValue|Default value for uncontrolled mode|`T`|`undefined`|
|valuePropName|Name of the value prop|`string`|`'value'`|
|target|Name of the change callback prop|`string`|`'onChange'`|

#### UseControllProps

|Property|Description|Type|Default|
|---|---|---|---|
|value|The controlled value|`T`|`undefined`|
|onChange|Change callback function|`(value: T) => void`|`undefined`|
|[key: string]|Any other props|`any`|`-`|

### return

|Property|Description|Type|
|---|---|---|
|value|Current value (controlled or internal state)|`T`|
|setValue|Function to update the value|`(value: T) => void`|