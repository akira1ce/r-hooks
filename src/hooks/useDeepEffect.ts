import { useRef, useEffect } from 'react';
import { isEqual } from '@/utils/object';

/**
 * useEffect with deep comparison of dependencies, usage is the same as useEffect
 */
export const useDeepEffect = (fn: () => () => void, deps: any[]) => {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return fn();
    }
  }, deps);
};
