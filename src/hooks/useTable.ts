import { get } from '@/utils/object';
import { useCallback, useEffect, useRef, useState } from 'react';

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

/**
 * Table data request
 * @example const { data, loading, total, pagination, fetchApi } = useTable(api, { defaultParams: { pageNum: 1, pageSize: 10 } });
 */
export default function useTable<T, K = Params>(api: Api<K, T>, options?: Options<K>) {
  const { manual, defaultParams, paths } = options || {};
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const _paths = { data: 'res.records', total: 'res.total', ...paths };

  const _params = useRef<any>({
    pageNum: 1,
    pageSize: 10,
    ...defaultParams,
  });

  const pagination = {
    current: _params.current.pageNum,
    pageSize: _params.current.pageSize,
    total,
    showTotal: (total: number) => `共${total}条`,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: (page: number, pageSize: number) => {
      _params.current.pageNum = page;
      _params.current.pageSize = pageSize;
      fetchApi();
    },
  };

  const fetchApi = useCallback((params?: Partial<K>) => {
    _params.current = { ..._params.current, ...params };
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!loading) return;
    api(_params.current)
      .then((ress) => {
        if (ress.code !== 0) throw new Error(ress.error);
        setData(get(ress, _paths.data) || []);
        setTotal(get(ress, _paths.total) || 0);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [loading]);

  useEffect(() => {
    if (manual) return;
    fetchApi();
  }, []);

  return {
    data,
    loading,
    total,
    pagination,
    fetchApi,
  };
}
