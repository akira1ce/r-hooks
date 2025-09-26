import { useState } from "react";
import { type DomTarget, getTargetElement } from "../helper/dom-target";
import { useEventListener } from "./use-event-listener";

/**
 * Mouse position and event data, including element-relative and element size info.
 */
export interface MousePosition {
	/** Mouse X coordinate relative to the viewport */
	clientX: number;
	/** Mouse Y coordinate relative to the viewport */
	clientY: number;
	/** Mouse X coordinate relative to the document */
	pageX: number;
	/** Mouse Y coordinate relative to the document */
	pageY: number;
	/** Mouse X coordinate relative to the screen */
	screenX: number;
	/** Mouse Y coordinate relative to the screen */
	screenY: number;
	/** Mouse X coordinate relative to the target element (left edge) */
	elementX: number;
	/** Mouse Y coordinate relative to the target element (top edge) */
	elementY: number;
	/** Width of the target element */
	elementW: number;
	/** Height of the target element */
	elementH: number;
	/** X position of the target element relative to the document */
	elementPosX: number;
	/** Y position of the target element relative to the document */
	elementPosY: number;
}

const defaultMousePosition: MousePosition = {
	clientX: NaN,
	clientY: NaN,
	pageX: NaN,
	pageY: NaN,
	screenX: NaN,
	screenY: NaN,
	elementX: NaN,
	elementY: NaN,
	elementW: NaN,
	elementH: NaN,
	elementPosX: NaN,
	elementPosY: NaN,
};

/**
 * React hook to track mouse position and event data on a target element.
 */
export const useMos = (target?: DomTarget<HTMLDivElement>): MousePosition => {
	const [mos, setMos] = useState<MousePosition>(defaultMousePosition);

	useEventListener(
		"mousemove",
		(e: MouseEvent) => {
			const { screenX, screenY, clientX, clientY, pageX, pageY } = e;

			const _mos = {
				screenX,
				screenY,
				clientX,
				clientY,
				pageX,
				pageY,
				elementX: NaN,
				elementY: NaN,
				elementH: NaN,
				elementW: NaN,
				elementPosX: NaN,
				elementPosY: NaN,
			};

			const el = getTargetElement(target);

			if (!el) return;

			const { left, top, width, height } = el.getBoundingClientRect();
			_mos.elementPosX = left + window.scrollX;
			_mos.elementPosY = top + window.scrollY;
			_mos.elementX = Math.max(0, pageX - _mos.elementPosX);
			_mos.elementY = Math.max(0, pageY - _mos.elementPosY);
			_mos.elementW = width;
			_mos.elementH = height;

			setMos(_mos);
		},
		{ target }
	);

	return mos;
};
