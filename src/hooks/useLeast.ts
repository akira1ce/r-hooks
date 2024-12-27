import { useRef } from 'react';

/**
 * Keeps the latest value
 * @example
 * const [value, setValue] = useState('foo');
 * const leastValue = useLeast(value);
 */
export default function useLeast<T>(value: T) {
  const state = useRef(value);
  state.current = value;

  return state.current;
}
