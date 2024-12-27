# use

## Feature
This hook mocks React's `use` method for handling promises.

## Usage
```js
import use from '../hooks/use';

const MyComponent = () => {
  const data = use(fetchData());

  return (
    <div>
      {data}
    </div>
  );
};
```

## Types
```ts
type PromiseWithStatus<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: any;
};

export default function use<T>(promise: PromiseWithStatus<T>): T;
```
