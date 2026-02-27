import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseQueryOptions<TParams, TData> {
	/** whether to manually trigger */
	manual?: boolean;
	/** default params */
	defaultParams?: TParams;
	/** default data */
	defaultData?: TData;
}

export type Service<TData, TParams> = (params?: TParams) => Promise<TData>;

export const useQuery = <TData, TParams>(
	api: Service<TData, TParams>,
	options: UseQueryOptions<TParams, TData> = {}
) => {
	const { manual = false, defaultParams = {}, defaultData } = options;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<TData>(defaultData as TData);

	const paramsRef = useRef<TParams>(defaultParams as TParams);

	/* execute request */
	const run = useMemoizedFn(async (params?: TParams) => {
		paramsRef.current = { ...paramsRef.current, ...params };
		try {
			setLoading(true);
			setError(null);
			const res = await api(paramsRef.current);
			setData(res);
			setLoading(false);
		} catch (err) {
			setError(err as Error);
			console.error("akira.err", err);
		} finally {
			setLoading(false);
		}
	});

	/* manually trigger */
	useEffect(() => {
		if (!manual) run();
	}, []);

	return { data, loading, run, error, params: paramsRef.current };
};
