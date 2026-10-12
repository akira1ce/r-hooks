import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseQueryOptions<TParams, TData> {
	/** whether to manually trigger */
	manual?: boolean;
	/** default params */
	defaultParams?: Partial<TParams>;
	/** default data */
	defaultData?: TData;
}

export type Service<TData, TParams = void> = (params: TParams) => Promise<TData>;

export interface UseQueryResult<TData, TParams> {
	data: TData;
	loading: boolean;
	error: Error | null;
	run: (params?: Partial<TParams>) => Promise<void>;
	params: TParams;
}

// 有默认数据：data 一定有值
export function useQuery<TData, TParams>(
	api: Service<TData, TParams>,
	options: UseQueryOptions<TParams, TData> & {
		defaultData: TData;
	}
): UseQueryResult<TData, TParams>;

// 没有默认数据：data 可能为 undefined
export function useQuery<TData, TParams>(
	api: Service<TData, TParams>,
	options?: UseQueryOptions<TParams, TData>
): UseQueryResult<TData | undefined, TParams>;

// 实现签名
export function useQuery<TData, TParams>(
	api: Service<TData, TParams>,
	options?: UseQueryOptions<TParams, TData>
): UseQueryResult<TData | undefined, TParams> {
	const { manual = false, defaultParams = {}, defaultData } = options || {};

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<TData | undefined>(defaultData);

	const paramsRef = useRef<TParams>(defaultParams as TParams);

	const _runner = useMemoizedFn(async () => {
		try {
			const res = await api(paramsRef.current);
			setData(res);
			setLoading(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err : new Error(String(err)));
			setLoading(false);
		}
	});

	const run = useMemoizedFn(async (params?: Partial<TParams>) => {
		paramsRef.current = {
			...paramsRef.current,
			...params,
		};

		setLoading(true);
		setError(null);
	});

	useEffect(() => {
		if (!loading) return;
		void _runner();
	}, [loading, _runner]);

	useEffect(() => {
		if (!manual) void run();
	}, []);

	return {
		data,
		loading,
		error,
		run,
		params: paramsRef.current,
	};
}
