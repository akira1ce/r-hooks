import { useCallback, useEffect, useRef } from "react";
import { useMemoizedFn } from "./use-memoized-fn";

export const useInterval = (cb: () => void, delay: number) => {
	const timer = useRef<number>();

	const memoizedCallback = useMemoizedFn(cb);

	const cancel = useCallback(() => {
		timer.current && clearInterval(timer.current);
	}, []);

	useEffect(() => {
		cancel();
		if (delay === null) return;
		timer.current = setInterval(memoizedCallback, delay);
	}, [delay]);
};
