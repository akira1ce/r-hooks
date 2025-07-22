import { useCallback, useState } from "react";

/**
 * Force update
 */
export const useUpdate = () => {
	const [_, update] = useState({});
	return useCallback(() => update({}), []);
};
