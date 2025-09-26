import { useEffect, useMemo, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseTableOptions<T> {
	defaultParams?: T;
	manual?: boolean;
}

export interface UseTableResponse<T> {
	total: number;
	list: T[];
	[key: string]: unknown;
}

export type UseTableApi<T, K> = (params: T) => Promise<UseTableResponse<K>>;

export interface UseTableResult<T, K> {
	data: K[];
	loading: boolean;
	total: number;
	run: (params: Partial<T>) => Promise<void>;
	params: T;
}

/**
 * Table data request hook with enhanced error handling and type safety
 * @param api - API function that returns table data
 * @param options - Configuration options
 * @returns Table state and control functions
 */
export const useTable = <T, K>(api: UseTableApi<T, K>, options?: UseTableOptions<T>): UseTableResult<T, K> => {
	const { manual = false, defaultParams } = options ?? {};

	const [data, setData] = useState<K[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);

	const paramsRef = useRef<T>(defaultParams as T);

	const fetchApi = useMemoizedFn(async (params: T): Promise<void> => {
		if (loading) return;

		setLoading(true);

		try {
			const res = await api(params);
			const _data = res.list ?? [];
			const _total = res.total ?? 0;

			setData(_data);
			setTotal(_total);
			setLoading(false);
		} catch (err) {
			setData([]);
			setTotal(0);
			setLoading(false);
		}
	});

	/**
	 * fetch api
	 * @description fetch api with partial params and merge with previous params, so you can update some params without fetching all params
	 */
	const run = useMemoizedFn(async (params: Partial<T> = {}): Promise<void> => {
		paramsRef.current = { ...paramsRef.current, ...params };
		await fetchApi(paramsRef.current);
	});

	// Auto-fetch on mount if not manual
	useEffect(() => {
		if (manual) return;
		fetchApi(paramsRef.current);
	}, [manual]);

	return { data, loading, total, run, params: paramsRef.current };
};
