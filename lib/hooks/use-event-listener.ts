import { useEffect } from "react";
import { type DomTarget, getTargetElement, type TargetType } from "../helper/dom-target";
import { useMemoizedFn } from "./use-memoized-fn";

/**
 * Options for useEventListener.
 */
export interface UseEventListenerOptions<T extends TargetType = TargetType> {
	/**
	 * The target to attach the event listener to.
	 * If not provided, defaults to `window`.
	 */
	target?: DomTarget<T>;
}

/**
 * useEventListener overloads for HTMLElement, Document, and Window.
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
	eventName: K,
	handler: (event: HTMLElementEventMap[K]) => void,
	options?: UseEventListenerOptions<HTMLElement>
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
	eventName: K,
	handler: (event: DocumentEventMap[K]) => void,
	options?: UseEventListenerOptions<Document>
): void;

export function useEventListener<K extends keyof WindowEventMap>(
	eventName: K,
	handler: (event: WindowEventMap[K]) => void,
	options?: UseEventListenerOptions<Window>
): void;

/**
 * React hook for adding event listeners to HTMLElement, Document, or Window.
 *
 * @param eventName - The event name to listen for.
 * @param handler - The event handler function.
 * @param options - Optional. The target to attach the event to.
 */
export function useEventListener(
	eventName: string,
	handler: (event: any) => void,
	options?: UseEventListenerOptions<any>
): void {
	const _handler = useMemoizedFn(handler);

	useEffect(() => {
		const target = getTargetElement(options?.target, window);

		if (!target || typeof (target as any).addEventListener !== "function") {
			console.warn(`Target is not an event target: ${target}`);
			return;
		}

		target.addEventListener(eventName, _handler);

		return () => {
			(target as EventTarget).removeEventListener(eventName, _handler);
		};
	}, [eventName, options?.target]);
}
