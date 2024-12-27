# useDeepEffect

## Feature
This hook works like `useEffect` but with deep comparison of dependencies.

## Usage
```js
import useDeepEffect from '../hooks/useDeepEffect';

const MyComponent = () => {
  const [value, setValue] = useState({ foo: 'bar' });

  useDeepEffect(() => {
    console.log('Effect triggered');
  }, [value]);

  return (
    <div>
      <button onClick={() => setValue({ foo: 'baz' })}>Change Value</button>
    </div>
  );
};
```

## Types
```ts
export default function useDeepEffect(fn: () => () => void, deps: any[]): void;
```
