import { type DependencyList, useEffect, useState } from "react";
import { type DomTarget, getTargetElement } from "@/helper/domTarget";

export const useAutoScroll = (target: DomTarget, deps: DependencyList = []) => {
	const [enableAutoScroll, setEnableAutoScroll] = useState(true);

	// 滚动到底部
	const scrollToBottom = () => {
		const el = getTargetElement(target);
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	};

	// 处理滚动事件
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const element = e.currentTarget;
		const isScrolledToBottom =
			Math.abs(
				element.scrollHeight - element.scrollTop - element.clientHeight,
			) < 1;
		setEnableAutoScroll(isScrolledToBottom);
	};

	// 监听依赖项变化，自动滚动到底部
	useEffect(() => {
		enableAutoScroll && scrollToBottom();
	}, [...deps, enableAutoScroll]);

	return {
		handleScroll,
		scrollToBottom,
		enableAutoScroll,
	};
};
