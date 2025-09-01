# useTable

表格数据请求管理 hook，提供分页、加载状态等表格常用功能。

## 功能

- 表格数据请求和状态管理
- 分页控制
- 加载状态
- 手动/自动请求控制
- 标准化 API 响应格式

## 用法

```typescript
import { useTable } from 'r-hooks';

// API 函数 - 需要返回标准格式
const fetchUsers = async (params) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.json(); // 返回 { code, error, res: { list, total } }
};

function UserTable() {
  const { data, loading, total, pagination, fetchApi, params } = useTable(fetchUsers, {
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
}

interface ResponseData<T> {
  total: number;
  list: T[];
  [key: string]: any;
}

interface Response<T> {
  code: number;
  error: string;
  res: ResponseData<T>;
}

type Api<T, K> = (params: T) => Promise<Response<K>>;

function useTable<T extends Params, K>(
  api: Api<T, K>,
  options?: Options<T>
)
```

## 返回类型

```typescript
{
  data: K[];
  loading: boolean;
  total: number;
  pagination: PaginationConfig;
  fetchApi: (params?: Partial<T>) => void;
  params: T;
}
```

| 属性       | 类型                            | 描述           |
| ---------- | ------------------------------- | -------------- |
| data       | `K[]`                           | 表格数据       |
| loading    | `boolean`                       | 加载状态       |
| total      | `number`                        | 总数据量       |
| pagination | `PaginationConfig`              | 分页配置对象   |
| fetchApi   | `(params?: Partial<T>) => void` | 请求数据函数   |
| params     | `T`                             | 当前请求参数   |

## 配置选项

| 属性          | 类型         | 默认值                         | 描述         |
| ------------- | ------------ | ------------------------------ | ------------ |
| defaultParams | `Partial<T>` | `{ pageNum: 1, pageSize: 10 }` | 默认请求参数 |
| manual        | `boolean`    | `false`                        | 是否手动触发 |

## API 响应格式约定

此 hook 需要与标准化的 API 响应格式配合使用：

- API 请求需要包含 `pageNum` 和 `pageSize` 参数
- API 响应需要包含 `code`、`error`、`res` 字段
- `res` 字段需要包含 `list`（数据数组）和 `total`（总数）字段
- 当 `code !== 0` 时会抛出错误
