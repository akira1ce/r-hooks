import { useMemo, useRef } from "react";
import { has } from "@/utils/object";
import { useMemoizedFn } from "./useMemoizedFn";
import { useUpdate } from "./useUpdate";

export interface UseControlOptions<T> {
	/** 默认值 */
	defaultValue?: T;
	/** 值的字段 */
	valuePropName?: string;
	/** 改变回调字的段 */
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
export const useControl = <T>(
	props: UseControllProps<T>,
	options?: UseControlOptions<T>,
) => {
	const {
		valuePropName = "value",
		target = "onChange",
		defaultValue = "defaultValue",
	} = options ?? {};

	const value = props[valuePropName] as T;

	const isControlled = has(props, valuePropName);

	const initialValue = useMemo(() => {
		if (isControlled) return value;
		return defaultValue;
	}, []);

	const state = useRef(initialValue);

	const update = useUpdate();

	if (isControlled) state.current = value;

	const setState = useMemoizedFn((v: T) => {
		if (!isControlled) {
			state.current = v;
			update();
		}
		props[target]?.(v);
	});

	return [state.current, setState] as const;
};
