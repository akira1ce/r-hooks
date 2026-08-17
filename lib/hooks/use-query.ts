import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseQueryOptions<TParams, TData> {
	/** whether to manually trigger */
	manual?: boolean;
	/** default params */
	defaultParams?: Partial<TParams>;
	/** default data */
	defaultData?: TData;
	/** polling interval(ms), <=0 means disable */
	pollingInterval?: number;
}

export type Service<TData, TParams = void> = (params: TParams) => Promise<TData>;

export const useQuery = <TData, TParams>(api: Service<TData, TParams>, options?: UseQueryOptions<TParams, TData>) => {
	const { manual = false, defaultParams = {}, defaultData, pollingInterval = 0 } = options || {};

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState(defaultData);

	const paramsRef = useRef<TParams>(defaultParams as TParams);
	const timerRef = useRef<number | null>(null);

	const cancel = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const run = useMemoizedFn(async (params?: TParams) => {
		paramsRef.current = {
			...paramsRef.current,
			...params,
		};

		cancel();

		try {
			setLoading(true);
			setError(null);

			const res = await api(paramsRef.current);

			setData(res);
			setLoading(false);
		} catch (err: any) {
			if (!err?.isCanceled) {
				setError(err);
				setLoading(false);
			}
		} finally {
			if (pollingInterval > 0) {
				timerRef.current = setTimeout(run, pollingInterval);
			}
		}
	});

	useEffect(() => {
		if (!manual) run();
		return cancel;
	}, []);

	return {
		data,
		loading,
		error,
		run,
		params: paramsRef.current,
		cancel,
	};
};
