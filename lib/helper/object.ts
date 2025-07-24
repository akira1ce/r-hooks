/**
 * Check if a nested property exists in an object
 * @example has({a:{b:1}},'a.b') => true
 */
export function has(obj: Record<string, any>, path: string | string[]): boolean {
  if (!obj || typeof obj !== 'object') return false;

  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;

  for (const key of keys) {
    if (!current || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    current = current[key];
  }
  return true;
}

/**
 * Deep compare two objects
 * @example isEqual({a:1},{a:1}) => true
 */
export function isEqual(value: any, other: any): boolean {
  if (value === other) return true;
  if (value && other && typeof value === 'object' && typeof other === 'object') {
    if (Array.isArray(value) !== Array.isArray(other)) return false;

    const keysA = Object.keys(value);
    const keysB = Object.keys(other);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key) || !isEqual(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * Get a nested property from an object
 * @example get({a:{b:1}},'a.b') => 1
 */
export function get<T = any>(
  obj: Record<string, any>,
  path: string | string[],
  defaultValue?: T
): T {
  if (!obj || typeof obj !== 'object') return defaultValue as T;

  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && key in current) {
      current = current[key];
    } else {
      return defaultValue as T;
    }
  }
  return current as T;
}
