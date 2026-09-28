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

	const paramsRef = useRef(defaultParams ?? ({} as T));

	const _runner = useMemoizedFn(async () => {
		try {
			const res = await api(paramsRef.current);
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
		paramsRef.current = { ...paramsRef.current, ...params } as T;
		setLoading(true);
	});

	useEffect(() => {
		if (!loading) return;
		_runner();
	}, [loading]);

	// Auto-fetch on mount if not manual
	useEffect(() => {
		if (manual) return;
		run();
	}, []);

	return { data, loading, total, run, params: paramsRef.current };
};
