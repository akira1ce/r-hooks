import { useMemo, useRef } from "react";
import { has } from "../helper/object";
import { useMemoizedFn } from "./use-memoized-fn";
import { useUpdate } from "./use-update";

export interface UseControlOptions<T> {
	/** default value */
	defaultValue?: T;
	/** value field */
	valuePropName?: string;
	/** change callback field */
	target?: string;
}

export interface UseControllProps<T> {
	value?: T;
	onChange?: (value: T) => void;
	[key: string]: any;
}

/**
 * Component controlled state management
 */
export const useControl = <T>(props: UseControllProps<T>, options?: UseControlOptions<T>) => {
	const { valuePropName = "value", target = "onChange", defaultValue } = options ?? {};

	const value = props[valuePropName] as T;

	const isControlled = has(props, valuePropName);

	const initialValue = useMemo(() => {
		if (isControlled) return value;
		return defaultValue;
	}, []);

	const state = useRef(initialValue);

	const update = useUpdate();

	if (isControlled) state.current = value;

	const setState = useMemoizedFn((v: T | ((prev: T) => T)) => {
		const newValue = typeof v === "function" ? (v as (prev: T) => T)(state.current as T) : v;

		if (!isControlled) {
			state.current = newValue;
			update();
		}
		props[target]?.(newValue);
	});

	return [state.current, setState] as const;
};
