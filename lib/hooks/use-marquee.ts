import { useCallback, useEffect, useRef } from "react";

export interface UseMarqueeOptions {
	deps?: any[];
	/** 是否自动播放 */
	autoPlay?: boolean;
	/** 自动播放步长 */
	autoPlayStep?: number;
}

/**
 * useMarquee
 * @notice trackRef 指向滚动轨道容器，其内部需要包裹一个列表容器。「trackRef -> list -> items」
 */
export function useMarquee(options: UseMarqueeOptions = {}) {
	const { deps = [], autoPlay = false, autoPlayStep = 0.3 } = options;

	/** 轨道引用 */
	const trackRef = useRef<HTMLDivElement>(null);

	/** 当前位置 */
	const position = useRef(0);
	/** 目标位置 */
	const target = useRef(0);
	/** 列表宽度 */
	const listWidth = useRef(0);
	/** 动画帧 ID */
	const rafId = useRef<number>(0);
	/** 是否暂停 */
	const paused = useRef(false);

	/** 动画函数 */
	const animate = useCallback(() => {
		const track = trackRef.current;
		if (!track) return;

		if (autoPlay && !paused.current) {
			target.current += autoPlayStep;
		}

		const diff = target.current - position.current;

		position.current += diff * 0.08;

		if (Math.abs(diff) < 0.1) {
			position.current = target.current;
		}

		if (position.current >= listWidth.current) {
			position.current -= listWidth.current;
			target.current -= listWidth.current;
		}

		if (position.current < 0) {
			position.current += listWidth.current;
			target.current += listWidth.current;
		}

		track.style.transform = `translate3d(-${position.current}px,0,0)`;

		rafId.current = requestAnimationFrame(animate);
	}, []);

	/** 测量列表宽度 */
	const measure = useCallback(() => {
		if (!trackRef.current) return;

		const track = trackRef.current;
		const list = track.children[0] as HTMLDivElement;

		if (!list) {
			console.error("has no list element in track element");
			listWidth.current = 0;
			return;
		}

		listWidth.current = list.offsetWidth;
	}, []);

	useEffect(() => {
		if (!trackRef.current) return;

		const track = trackRef.current;

		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(track);

		measure();
		animate();

		return () => {
			resizeObserver.disconnect();
			cancelAnimationFrame(rafId.current);
		};
	}, deps);

	/** 下一项 */
	const next = useCallback((step: number) => {
		target.current += step;
	}, []);

	/** 上一项 */
	const prev = useCallback((step: number) => {
		target.current -= step;
	}, []);

	/** 暂停 */
	const pause = useCallback(() => {
		paused.current = true;
	}, []);

	/** 恢复 */
	const resume = useCallback(() => {
		paused.current = false;
	}, []);

	return { trackRef, next, prev, pause, resume };
}
