import { useState, useCallback, useRef } from 'react';

export interface RequestCallbacks {
  onUpdate: (message: string) => void;
  onError: (error: Error) => void;
  onSuccess: (message: string[]) => void;
}

/**
 * handle state in streaming fetch
 * @param url ai-fetch-url
 * @param token ai-token
 */
const useFetchStream = (url: string, token: string) => {
  const [loading, setLoading] = useState<boolean>(false);

  const messages = useRef<string[]>([]);

  /* fetch-abort-single */
  const abortControllerRef = useRef<AbortController | null>(null);

  /* abort-fetch */
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const fetchApi = useCallback(async (params: any, callbacks: RequestCallbacks) => {
    const { onError, onSuccess, onUpdate } = callbacks;
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token },
        body: JSON.stringify({ ...params }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { done: chunkDone, value: chunk } = await reader!.read();
        done = chunkDone;
        const chunkContent = decoder.decode(chunk, { stream: !done });
        messages.current.push(chunkContent);
        onUpdate(chunkContent);
      }

      onSuccess(messages.current);
    } catch (err: any) {
      onError(err);
      console.error('err :>> ', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchApi, abort };
};

export default useFetchStream;
