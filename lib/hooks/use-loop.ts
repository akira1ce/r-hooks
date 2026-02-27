import { useRef } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export interface UseLoopOptions {
	/** interval of polling */
	pollingInterval: number;
	/** retry count of polling */
	pollingRetryCount: number;
}

export const useLoop = (cb: () => void | Promise<void>, options: UseLoopOptions) => {
	const { pollingInterval = 1000, pollingRetryCount = 10 } = options;

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryCountRef = useRef(0);
	const isRunningRef = useRef(false);

	const stableCb = useMemoizedFn(cb);

	const stop = useMemoizedFn(() => {
		isRunningRef.current = false;
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	});

	const schedule = useMemoizedFn(() => {
		if (!isRunningRef.current) return;

		timerRef.current = setTimeout(async () => {
			if (!isRunningRef.current) return;

			try {
				await stableCb();
				retryCountRef.current = 0;
			} catch (e) {
				retryCountRef.current += 1;
				if (retryCountRef.current >= pollingRetryCount) {
					stop();
					return;
				}
			}

			schedule();
		}, pollingInterval);
	});

	const start = useMemoizedFn(() => {
		if (isRunningRef.current) return;
		isRunningRef.current = true;
		retryCountRef.current = 0;
		schedule();
	});

	return { start, stop, isRunning: isRunningRef.current };
};
