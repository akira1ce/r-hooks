import { type DomTarget, getTargetElement } from "../helper/dom-target";
import { useEventListener } from "./use-event-listener";

export const useClickAway = (target: DomTarget, handler: (e: MouseEvent) => void) => {
	useEventListener("mousedown", (e) => {
		const el = getTargetElement(target);
		if (!el || el.contains(e.target as Node)) return;
		handler(e);
	});
};
