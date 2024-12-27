# useLoopFetch

## Feature
This hook handles loop fetching with a specified interval and overtimes.

## Usage
```js
import useLoopFetch from '../hooks/useLoopFetch';

const MyComponent = () => {
  const { data, loading, run, cancel, isOvertime } = useLoopFetch(api, { pollingInterval: 1000, pollingOvertimes: 5 });

  useEffect(() => {
    run();
    return () => cancel();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : data}
      {isOvertime && <div>Polling Overtime</div>}
    </div>
  );
};
```

## Types
```ts
interface IUseLoopFetchOptions {
  pollingInterval?: number;
  pollingOvertimes?: number;
}

type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

export default function useLoopFetch<TData, TParams extends any[]>(
  api: Service<TData, TParams>,
  options?: IUseLoopFetchOptions
): {
  data: TData | undefined;
  loading: boolean;
  run: (...params: TParams) => void;
  runAsync: (...params: TParams) => Promise<TData | undefined>;
  cancel: () => void;
  isOvertime: boolean;
};
