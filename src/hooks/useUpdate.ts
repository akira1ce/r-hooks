import { useState, useCallback } from 'react';

/**
 * Force update
 * @example const update = useUpdate();
 */
export default function useUpdate() {
  const [_, update] = useState({});
  return useCallback(() => update({}), []);
}
