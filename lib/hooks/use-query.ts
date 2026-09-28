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

export const useQuery = <TData, TParams>(api: Service<TData, TParams>, options?: UseQueryOptions<TParams, TData>) => {
	const { manual = false, defaultParams = {}, defaultData } = options || {};

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState(defaultData);

	const paramsRef = useRef<TParams>(defaultParams as TParams);

	const _runner = useMemoizedFn(async () => {
		try {
			const res = await api(paramsRef.current);
			setData(res);
			setLoading(false);
		} catch (err: any) {
			setError(err);
			setLoading(false);
		}
	});

	const run = useMemoizedFn(async (params?: TParams) => {
		paramsRef.current = { ...paramsRef.current, ...params };
		setLoading(true);
		setError(null);
	});

	useEffect(() => {
		if (!loading) return;
		_runner();
	}, [loading]);

	useEffect(() => {
		if (!manual) run();
	}, []);

	return {
		data,
		loading,
		error,
		run,
		params: paramsRef.current,
	};
};
