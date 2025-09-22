/**
 * Debounce function
 * @example const debounced = debounce(() => console.log('Hello'), 1000);
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

/**
 * Throttle function
 * @example const throttled = throttle(() => console.log('Hello'), 1000);
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastCall >= limit) {
			lastCall = now;
			func(...args);
		}
	};
}
