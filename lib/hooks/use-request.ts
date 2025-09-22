import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseRequestOptions {
	/** whether to manually trigger */
	manual?: boolean;
	/** polling interval */
	pollingInterval?: number;
	/** polling retry count */
	pollingRetryCount?: number;
}

export type Service<TData, TParams> = (params?: TParams) => Promise<TData>;

export const useRequest = <TData, TParams>(api: Service<TData, TParams>, options: UseRequestOptions = {}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<TData>();

	/* polling timer */
	const timer = useRef<any>(null);
	const retryCount = useRef(0);

	const { manual = false, pollingInterval, pollingRetryCount } = options;

	/* cancel polling */
	const cancel = useMemoizedFn(() => {
		if (timer.current) {
			console.log("akira.timer.current :>> ", timer.current);
			clearTimeout(timer.current);
			timer.current = null;
			console.log("akira.timer.current :>> ", timer.current);
			retryCount.current = 0;
		}
	});

	/* polling */
	const _loop = useMemoizedFn((params?: TParams) => {
		/* when polling retry count is -1, polling infinitely */
		if (pollingRetryCount && retryCount.current >= pollingRetryCount) return;
		retryCount.current++;
		timer.current = setTimeout(() => {
			run(params);
		}, pollingInterval);
		console.log("akira._loop.timer.current :>> ", timer.current);
	});

	/* execute request */
	const run = useMemoizedFn(async (params?: TParams) => {
		try {
			setLoading(true);
			const res = await api(params);
			if (pollingInterval) _loop(params);
			setData(res);
			setLoading(false);
			return res;
		} catch (err) {
			setLoading(false);
			console.error(err);
		}
	});

	/* manually trigger */
	useEffect(() => {
		if (!manual) run();
	}, []);

	return { data, loading, cancel, run };
};
