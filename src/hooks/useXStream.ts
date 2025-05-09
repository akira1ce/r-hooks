import { useMemoizedFn } from './useMemoizedFn';
import { useCallback, useRef, useState } from 'react';

export interface UseXStreamOptions {
  /** 转换器 */
  transform?: (value: string) => string;
}

export type Fetcher = (params: any, signal?: AbortSignal) => Promise<Response>;

export const useXStream = (fetcher: Fetcher, options: UseXStreamOptions = {}) => {
  const { transform } = options;

  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const controller = useRef<AbortController>(null);
  const bufferRef = useRef('');

  const _transform = useMemoizedFn(transform ?? ((val) => val));

  /* 转换 SSE 数据 */
  const transformChunk = (chunk: string) => {
    bufferRef.current += chunk;
    const chunks = bufferRef.current.split('\n');

    const lines: string[] = [];
    let currentData = '';

    chunks.map((item) => {
      if (item.startsWith('data:')) currentData += item.replace('data:', '').trim();

      // SSE 段落结束
      if (item === '') {
        if (currentData) {
          lines.push(currentData);
          currentData = '';
        }
      }
    });

    // 保留未完成段落
    bufferRef.current = currentData ? `data: ${currentData}\n` : '';

    return lines;
  };

  const cancel = useCallback(() => {
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }
  }, []);

  const run = useCallback(async (params: any) => {
    // 重置状态
    setLoading(true);
    setError(null);
    setContent('');
    bufferRef.current = '';

    // 取消之前的请求
    cancel();

    // 创建新的 AbortController
    controller.current = new AbortController();

    try {
      const response = await fetcher(params, controller.current.signal);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let value = '';

      while (true) {
        const { done, value: chunk } = await reader.read();

        if (done) break;

        const decodedChunk = decoder.decode(chunk);

        const lines = transformChunk(decodedChunk);

        console.log('lines :>> ', lines);

        lines.map((item) => {
          const transformedChunk = _transform(item);

          console.log('transformedChunk :>> ', transformedChunk);
          value += transformedChunk;
          setContent(value);
        });
      }

      setLoading(false);
    } catch (err: any) {
      setError(err);
      setLoading(false);

      // 错误处理
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Stream error:', err);
      }
    }
  }, []);

  return { content, loading, error, run, cancel };
};
