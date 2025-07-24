import { useRef, useState } from "react";
import { useMemoizedFn } from "./useMemoizedFn";

export interface UseXStreamOptions {
	/** transformer */
	transform?: (value: string) => string;
}

export type Fetcher = (params: any, signal?: AbortSignal) => Promise<Response>;

/**
 * stream request
 */
export const useXStream = (
	fetcher: Fetcher,
	options: UseXStreamOptions = {},
) => {
	const { transform } = options;

	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const controller = useRef<AbortController | null>(null);
	const bufferRef = useRef("");

	const _transform = useMemoizedFn(transform ?? ((val) => val));

	/* transform SSE data */
	const transformChunk = (chunk: string) => {
		bufferRef.current += chunk;
		const chunks = bufferRef.current.split("\n");

		const lines: string[] = [];
		let currentData = "";

		chunks.map((item) => {
			currentData += item.trim();

			/* SSE paragraph end */
			if (item === "" && currentData !== "") {
				lines.push(currentData);
				currentData = "";
			}
		});

		/* keep incomplete paragraph */
		bufferRef.current = currentData;

		return lines;
	};

	const cancel = () => {
		if (controller.current) {
			controller.current.abort();
			controller.current = null;
		}
	};

	const run = useMemoizedFn(async (params: any) => {
		/* reset state */
		setLoading(true);
		setError(null);
		setContent("");
		bufferRef.current = "";

		/* cancel previous request */
		cancel();

		/* create new AbortController */
		controller.current = new AbortController();

		try {
			const response = await fetcher(params, controller.current.signal);

			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}

			if (!response.body) {
				throw new Error("Response body is null");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let value = "";

			while (true) {
				const { done, value: chunk } = await reader.read();

				if (done) break;

				const decodedChunk = decoder.decode(chunk);
				const lines = transformChunk(decodedChunk);

				lines.map((item) => {
					const transformedChunk = _transform(item);
					value += transformedChunk;
					setContent(value);
				});
			}

			setLoading(false);
		} catch (err: any) {
			setError(err);
			setLoading(false);

			/* error handling */
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				console.error("Stream error:", err);
			}
		}
	});

	return { content, loading, error, run, cancel };
};
