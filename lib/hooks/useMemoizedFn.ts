import { useMemo, useRef } from "react";

type Noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends Noop> = (
	this: ThisParameterType<T>,
	...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedFn<T extends Noop>(fn: T) {
	const fnRef = useRef<T>(fn);

	fnRef.current = useMemo<T>(() => fn, [fn]);

	const memoizedFn = useRef<PickFunction<T> | null>(null);

	if (!memoizedFn.current) {
		memoizedFn.current = function (this, ...args) {
			return fnRef.current.apply(this, args);
		};
	}

	return memoizedFn.current as PickFunction<T>;
}
