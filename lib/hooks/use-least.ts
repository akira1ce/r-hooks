import { useRef } from "react";

/**
 * Keeps the latest value
 */
export const useLeast = <T>(value: T) => {
	const state = useRef(value);
	state.current = value;

	return state.current;
};
