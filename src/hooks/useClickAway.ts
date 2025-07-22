import type { RefObject } from "react";
import { useEventListener } from "./useEventListener";

export const useClickAway = <T extends HTMLElement>(
	elementRef: RefObject<T>,
	handler: (e: Event) => void,
) => {
	useEventListener("mousedown", (e) => {
		const el = elementRef?.current;

		if (!el || el.contains(e.target as Node)) return;

		handler(e);
	});
};
