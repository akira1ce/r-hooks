# useLeast

## Feature
This hook keeps the latest value.

## Usage
```js
import useLeast from '../hooks/useLeast';

const MyComponent = () => {
  const [value, setValue] = useState('foo');
  const leastValue = useLeast(value);

  return (
    <div>
      <div>Current Value: {value}</div>
      <div>Least Value: {leastValue}</div>
      <button onClick={() => setValue('bar')}>Change Value</button>
    </div>
  );
};
```

## Types
```ts
export default function useLeast<T>(value: T): T;
```
