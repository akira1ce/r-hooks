import { useEffect, useMemo, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseTableOptions<T, K = unknown> {
	defaultParams?: T;
	manual?: boolean;
}

export interface UseTableResponse<T> {
	total: number;
	list: T[];
	[key: string]: unknown;
}

export type UseTableApi<T, K> = (params: T) => Promise<UseTableResponse<K>>;

export interface UseTablePagination {
	total: number;
	showTotal: (total: number) => string;
	showQuickJumper: boolean;
	showSizeChanger: boolean;
}

export interface UseTableResult<T, K> {
	data: K[];
	loading: boolean;
	total: number;
	error: Error | null;
	pagination: UseTablePagination;
	fetchApi: (params: T) => Promise<void>;
	refresh: () => Promise<void>;
	params: T;
}

/**
 * Table data request hook with enhanced error handling and type safety
 *
 * @param api - API function that returns table data
 * @param options - Configuration options
 * @returns Table state and control functions
 */
export const useTable = <T, K>(api: UseTableApi<T, K>, options?: UseTableOptions<T, K>): UseTableResult<T, K> => {
	const { manual = false, defaultParams } = options ?? {};

	const [data, setData] = useState<K[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [error, setError] = useState<Error | null>(null);

	const searchParamsRef = useRef<T>(defaultParams as T);
	const isInitialMount = useRef(true);

	const pagination = useMemo(
		(): UseTablePagination => ({
			total,
			showTotal: (total: number) => `共${total}条`,
			showQuickJumper: true,
			showSizeChanger: true,
		}),
		[total]
	);

	const executeRequest = useMemoizedFn(async (params: T): Promise<void> => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			const response = await api(params);
			const newData = response.list ?? [];
			const newTotal = response.total ?? 0;

			setData(newData);
			setTotal(newTotal);
		} catch (err) {
			setData([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	});

	const fetchApi = useMemoizedFn(async (params: T): Promise<void> => {
		searchParamsRef.current = params;
		await executeRequest(params);
	});

	const refresh = useMemoizedFn(async (): Promise<void> => {
		await executeRequest(searchParamsRef.current);
	});

	// Auto-fetch on mount if not manual
	useEffect(() => {
		if (manual || !isInitialMount.current) return;

		isInitialMount.current = false;
		if (searchParamsRef.current) {
			executeRequest(searchParamsRef.current);
		}
	}, [manual]);

	return { data, loading, total, error, pagination, fetchApi, refresh, params: searchParamsRef.current };
};
