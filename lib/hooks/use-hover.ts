import { useState } from "react";
import { DomTarget } from "@/helper/dom-target";
import { useEventListener } from "./use-event-listener";

/**
 * React hook to track hover state of a target element.
 * @param target - The target element to track hover on.
 * @returns The hover state.
 */
export const useHover = (target: DomTarget) => {
	const [isHovering, setIsHovering] = useState(false);

	useEventListener("mouseenter", () => setIsHovering(true), { target: target as DomTarget<HTMLElement> });
	useEventListener("mouseleave", () => setIsHovering(false), { target: target as DomTarget<HTMLElement> });

	return isHovering;
};
