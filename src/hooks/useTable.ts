import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "@/utils/function";
import { get } from "@/utils/object";

/* you may need to customize the params */
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

/* you may need to customize the response */
interface ResponseData<T> {
	total: number;
	records: T[];
	[key: string]: any;
}

/* you may need to customize the response */
interface Response<T> {
	code: number;
	error: string;
	res: ResponseData<T>;
	trace: string;
}

type Api<T, K> = (params: T) => Promise<Response<K>>;

/**
 * Table data request
 * Need to be agreed with the agreement
 * @example const { data, loading, total, pagination, fetchApi } = useTable(api, { defaultParams: { pageNum: 1, pageSize: 10 } });
 */
export const useTable = <T, K>(api: Api<T, K>, options?: Options<T>) => {
	const { manual, defaultParams, paths } = options || {};
	const [data, setData] = useState<K[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);

	/* you may need to customize the paths */
	const _paths = { data: "res.records", total: "res.total", ...paths };

	/* you may need to customize the params */
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

	const fetchApi = useCallback(
		debounce((params?: Partial<T>) => {
			_params.current = { ..._params.current, ...params };
			setLoading(true);
		}, 300),
		[],
	);

	useEffect(() => {
		if (!loading) return;
		api(_params.current)
			.then((ress) => {
				/* you may need to customize the response */
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
};
