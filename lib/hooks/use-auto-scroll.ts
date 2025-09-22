import { type DependencyList, useEffect, useState } from "react";
import { type DomTarget, getTargetElement } from "../helper/dom-target";

export const useAutoScroll = (target: DomTarget, deps: DependencyList = []) => {
	const [enableAutoScroll, setEnableAutoScroll] = useState(true);

	/* scroll to bottom */
	const scrollToBottom = () => {
		const el = getTargetElement(target);
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	};

	/* handle scroll event */
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const element = e.currentTarget;
		const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
		setEnableAutoScroll(isScrolledToBottom);
	};

	/* listen to dependency changes, auto scroll to bottom */
	useEffect(() => {
		enableAutoScroll && scrollToBottom();
	}, [...deps, enableAutoScroll]);

	return {
		handleScroll,
		scrollToBottom,
		enableAutoScroll,
	};
};
