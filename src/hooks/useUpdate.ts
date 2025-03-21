import { useState, useCallback } from 'react';

/**
 * Force update
 */
export default function useUpdate() {
  const [_, update] = useState({});
  return useCallback(() => update({}), []);
}
