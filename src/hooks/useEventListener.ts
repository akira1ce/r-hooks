import type { RefObject } from "react";
import { useEffect } from "react";
import { useMemoizedFn } from "./useMemoizedFn";

export interface UseEventListenerOptions<T> {
	target?: RefObject<T>;
}

export const useEventListener = <T extends HTMLElement>(
	eventName: keyof HTMLElementEventMap,
	handler: (event: Event) => void,
	options?: UseEventListenerOptions<T>,
) => {
	const _handler = useMemoizedFn(handler);

	useEffect(() => {
		const element = options?.target?.current || window;

		if (!element || !element.addEventListener) return;

		element.addEventListener(eventName, _handler);

		return () => {
			element.removeEventListener(eventName, _handler);
		};
	}, [eventName]);
};
