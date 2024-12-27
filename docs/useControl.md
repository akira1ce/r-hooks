# useControl

## Feature
This hook manages component controlled state.

## Usage
```js
import useControl from '../hooks/useControl';

const MyComponent = (props) => {
  const [value, setValue] = useControl(props, { defaultValue: 'default' });

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};
```

## Types
```ts
export interface UseControlOptions<T> {
  defaultValue?: T;
  valuePropName?: string;
  target?: string;
}

export interface UseControllProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  [key: string]: any;
}

export default function useControl<T>(props: UseControllProps<T>, options?: UseControlOptions<T>): readonly [T, (v: T) => void];
```
