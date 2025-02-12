import { has } from '@/utils/object';
import { useCallback, useMemo, useRef } from 'react';
import useUpdate from './useUpdate';

export interface UseControlOptions<T> {
  defaultValue?: T;
  valuePropName?: string;
  target?: string;
}

export interface UseControllProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  [key: string]: any;
}

/**
 * Component controlled state management
 * @example const [value, setValue] = useControl(props);
 */
export default function useControl<T>(props: UseControllProps<T>, options?: UseControlOptions<T>) {
  const {
    valuePropName = 'value',
    target = 'onChange',
    defaultValue = 'defaultValue',
  } = options ?? {};

  const value = props[valuePropName] as T;

  const isControlled = has(props, valuePropName);

  const initialValue = useMemo(() => {
    if (isControlled) return value;
    return defaultValue;
  }, []);

  const state = useRef(initialValue);

  const update = useUpdate();

  if (isControlled) state.current = value;

  const setState = useCallback((v: T) => {
    if (!isControlled) {
      state.current = v;
      update();
    }
    props[target]?.(v);
  }, []);

  return [state.current, setState] as const;
}
