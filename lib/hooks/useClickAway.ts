import { type DomTarget, getTargetElement } from "@/helper/domTarget";
import { useEventListener } from "./useEventListener";

export const useClickAway = (
	target: DomTarget,
	handler: (e: MouseEvent) => void,
) => {
	useEventListener("mousedown", (e) => {
		const el = getTargetElement(target);
		if (!el || el.contains(e.target as Node)) return;
		handler(e);
	});
};
