# useTable

表格数据请求管理 hook，提供分页、加载状态等表格常用功能。

## 功能

- 表格数据请求和状态管理
- 分页控制
- 加载状态
- 自定义数据路径
- 手动/自动请求控制

## 用法

```typescript
import { useTable } from 'r-hooks';

// API 函数
const fetchUsers = async (params) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.json();
};

function UserTable() {
  const { data, loading, total, pagination, fetchApi } = useTable(fetchUsers, {
    defaultParams: { pageNum: 1, pageSize: 20 },
    manual: false,
  });

  const handleSearch = (keyword) => {
    fetchApi({ keyword, pageNum: 1 });
  };

  return (
    <div>
      <Table 
        dataSource={data}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
}
```

## 入参类型

```typescript
interface Params {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}

interface Options<T> {
  defaultParams?: Partial<T>;
  manual?: boolean;
  paths?: {
    data?: string;
    total?: string;
  };
}

function useTable<T, K = Params>(
  api: (params: K) => Promise<Response<T>>, 
  options?: Options<K>
)
```

## 返回类型

```typescript
{
  data: T[];
  loading: boolean;
  total: number;
  pagination: PaginationConfig;
  fetchApi: (params?: Partial<K>) => void;
}
```

| 属性       | 类型                            | 描述         |
| ---------- | ------------------------------- | ------------ |
| data       | `T[]`                           | 表格数据     |
| loading    | `boolean`                       | 加载状态     |
| total      | `number`                        | 总数据量     |
| pagination | `PaginationConfig`              | 分页配置对象 |
| fetchApi   | `(params?: Partial<K>) => void` | 请求数据函数 |

## 配置选项

| 属性          | 类型         | 默认值                                        | 描述         |
| ------------- | ------------ | --------------------------------------------- | ------------ |
| defaultParams | `Partial<K>` | `{ pageNum: 1, pageSize: 10 }`                | 默认请求参数 |
| manual        | `boolean`    | `false`                                       | 是否手动触发 |
| paths         | `object`     | `{ data: 'res.records', total: 'res.total' }` | 数据路径配置 |
