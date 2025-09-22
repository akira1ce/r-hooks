import type { RefObject } from "react";

export type TargetValue<T> = T | undefined | null;

export type TargetType = HTMLElement | Element | Window | Document;

export type DomTarget<T extends TargetType = Element> = TargetValue<T> | RefObject<TargetValue<T>>;

export const isBrowser = !!(typeof window !== "undefined" && window.document && window.document.createElement);

/**
 * Get the target element from the target object.
 * @param target - The target object.
 * @param defaultTarget - The default target element.
 * @returns The target element.
 */
export const getTargetElement = <T extends TargetType>(target: DomTarget<T>, defaultTarget?: T) => {
	if (!isBrowser) return null;

	if (!target) return defaultTarget;
	if ("current" in target) return target.current;

	return target;
};
