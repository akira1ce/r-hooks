import { useCallback, useEffect, useRef, useState } from "react";

export interface Params {
	pageNum: number;
	pageSize: number;
	[key: string]: any;
}

export interface Options<T> {
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

const DEFAULT_PARAMS: Params = { pageNum: 1, pageSize: 10 };

/**
 * Table data request
 * Need to be agreed with the agreement
 * api request need has pageNum、pageSize
 * api return need has code、error、res，res need has list、total
 */
export const useTable = <T extends Params, K>(
	api: Api<T, K>,
	options?: Options<T>,
) => {
	const { manual, defaultParams = DEFAULT_PARAMS } = options || {};
	const [data, setData] = useState<K[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);

	const paramsRef = useRef<T>(defaultParams as any);

	const pagination = {
		current: paramsRef.current.pageNum,
		pageSize: paramsRef.current.pageSize,
		total,
		showTotal: (total: number) => `共${total}条`,
		showQuickJumper: true,
		showSizeChanger: true,
		onChange: (page: number, pageSize: number) => {
			paramsRef.current.pageNum = page;
			paramsRef.current.pageSize = pageSize;
			fetchApi();
		},
	};

	const fetchApi = useCallback((params?: Partial<T>) => {
		paramsRef.current = { ...paramsRef.current, ...params };
		setLoading(true);
	}, []);

	useEffect(() => {
		if (!loading) return;
		api(paramsRef.current)
			.then(({ res, code, error }) => {
				/* you may need to customize the response */
				if (code !== 0) throw new Error(error);
				setData(res.list || []);
				setTotal(res.total || 0);
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
		params: paramsRef.current,
	};
};
