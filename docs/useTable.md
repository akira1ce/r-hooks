# useTable

## Feature
This hook handles table data fetching and pagination.

## Usage
```js
import useTable from '../hooks/useTable';

const MyComponent = () => {
  const { data, loading, total, pagination, fetchApi } = useTable(api, { defaultParams: { pageNum: 1, pageSize: 10 } });

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : data.map(item => <div key={item.id}>{item.name}</div>)}
      <Pagination {...pagination} />
    </div>
  );
};
```

## Types
```ts
export interface Params {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}

export interface Options<T> {
  defaultParams?: Partial<T>;
  manual?: boolean;
  paths?: {
    data?: string;
    total?: string;
  };
}

interface ResponseData<T> {
  total: number;
  records: T[];
  [key: string]: any;
}

interface Response<T> {
  code: number;
  error: string;
  res: ResponseData<T>;
  trace: string;
}

type Api<T, K> = (params: T) => Promise<Response<K>>;

export default function useTable<T, K = Params>(api: Api<K, T>, options?: Options<K>): {
  data: T[];
  loading: boolean;
  total: number;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showTotal: (total: number) => string;
    showQuickJumper: boolean;
    showSizeChanger: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  fetchApi: (params?: Partial<K>) => void;
};
```
