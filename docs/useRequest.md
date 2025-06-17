# useRequest

请求管理 hook，提供统一的 API 请求解决方案，支持手动触发、轮询等功能。

## 功能

提供完整的请求管理能力：
- 自动或手动触发请求
- 加载状态管理
- 轮询功能
- 轮询重试次数控制
- 请求取消

## 用法

```tsx
import { useRequest } from 'r-hooks';

// 定义 API 函数
const fetchUserData = async (userId?: string) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

function UserProfile({ userId }) {
  // 自动发起请求
  const { data, loading, run, cancel } = useRequest(fetchUserData, {
    manual: false, // 组件加载时自动执行
  });

  // 手动触发请求
  const { 
    data: manualData, 
    loading: manualLoading, 
    run: fetchManually 
  } = useRequest(fetchUserData, {
    manual: true, // 需要手动调用 run
  });

  // 轮询请求
  const { data: pollingData, cancel: stopPolling } = useRequest(fetchUserData, {
    pollingInterval: 5000, // 每5秒轮询一次
    pollingRetryCount: 10, // 最多轮询10次
  });

  const handleRefresh = () => {
    run(userId); // 手动刷新
  };

  const handleManualFetch = () => {
    fetchManually(userId); // 手动触发
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <button onClick={handleRefresh}>刷新</button>
      <button onClick={handleManualFetch}>手动获取</button>
      <button onClick={stopPolling}>停止轮询</button>
    </div>
  );
}
```

## 入参类型

```typescript
export interface UseRequestOptions {
  /** 是否手动触发 */
  manual?: boolean;
  /** 轮询间隔（毫秒） */
  pollingInterval?: number;
  /** 轮询重试次数 */
  pollingRetryCount?: number;
}

export type Service<TData, TParams> = (params?: TParams) => Promise<TData>;

function useRequest<TData, TParams>(
  api: Service<TData, TParams>,
  options?: UseRequestOptions
): {
  data: TData | undefined;
  loading: boolean;
  run: (params?: TParams) => Promise<TData | undefined>;
  cancel: () => void;
}
```

### 参数

| 参数    | 类型                      | 描述                             |
| ------- | ------------------------- | -------------------------------- |
| api     | `Service<TData, TParams>` | 请求函数，接收参数并返回 Promise |
| options | `UseRequestOptions`       | 配置选项                         |

### Options 配置

| 属性              | 类型      | 默认值  | 描述                                          |
| ----------------- | --------- | ------- | --------------------------------------------- |
| manual            | `boolean` | `false` | 是否手动触发，为 `false` 时组件加载后自动执行 |
| pollingInterval   | `number`  | -       | 轮询间隔时间（毫秒），设置后启用轮询          |
| pollingRetryCount | `number`  | -       | 轮询重试次数，`-1` 表示无限轮询               |

## 返回类型

```typescript
{
  data: TData | undefined;
  loading: boolean;
  run: (params?: TParams) => Promise<TData | undefined>;
  cancel: () => void;
}
```

### 返回值

| 属性    | 类型                                                | 描述               |
| ------- | --------------------------------------------------- | ------------------ |
| data    | `TData \| undefined`                                | 请求返回的数据     |
| loading | `boolean`                                           | 请求加载状态       |
| run     | `(params?: TParams) => Promise<TData \| undefined>` | 手动触发请求的函数 |
| cancel  | `() => void`                                        | 取消轮询的函数     |



