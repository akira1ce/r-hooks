# useUpdate

## Feature
This hook forces a component to re-render.

## Usage
```js
import useUpdate from '../hooks/useUpdate';

const MyComponent = () => {
  const update = useUpdate();

  return (
    <div>
      <button onClick={update}>Force Update</button>
    </div>
  );
};
```

## Types
```ts
export default function useUpdate(): () => void;
```
