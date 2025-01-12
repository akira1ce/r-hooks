# useContextStore

## Feature
This hook manages component controlled state.

## Usage
```js
import useContextStore from '../hooks/useContextStore';

const useHook = () => {
  return {
    name: 'John',
  };
};

const MyComponent = () => {
  const {Provider, useStore} = useContextStore(useHook);
  const state = useStore();

  return (
    <Provider>
      <div>{state.name}</div>
    </Provider>
  );
};
```

## Types
```ts
export interface Store<T> {
  Provider: React.FC<ProviderProps>;
  useStore: () => T;
}

interface ProviderProps {
  children?: ReactNode;
}

export type Hook<State, Params = void> = (params?: Params) => State;

export default function useContextStore<State, Params = void>(useHook: Hook<State, Params>, params?: Params): Store<State>;
```
