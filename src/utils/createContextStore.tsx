import { useContext, createContext, ReactNode, memo, useMemo } from 'react';

export interface Store<T> {
  Provider: React.FC<ProviderProps>;
  useStore: () => T;
}

interface ProviderProps {
  children?: ReactNode;
}

export type Hook<State, Params = void> = (params?: Params) => State;

/**
 * Context state management
 * remember, this hook should be called in a separate module and export its, then import into other modules to using.
 * @example
 * ```js
 * // models/a.js
 * import useHook from 'xxx'
 * export const { Provider, useStore } = createContextStore(useHook)
 *
 * // Comp.js
 * import { Provider, useStore } from 'xxx/models/a.js'
 *
 * const ChildComp = () => {
 *   const store = useStore();
 *   return <>ChildComp</>
 * }
 *
 * const Comp = () => {
 *   const store = useStore();
 *     return <>
 *       <Provider>
 *         <ChildComp/>
 *       </Provider>
 *     </>
 * }
 * ```
 *
 */
function createContextStore<State, Params = void>(
  useHook: Hook<State, Params>,
  params?: Params
): Store<State> {
  const Context = createContext<State | null>(null);

  const Provider: React.FC<ProviderProps> = memo(({ children }) => {
    const value = useMemo(() => useHook(params), [params]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  });

  function useStore(): State {
    const state = useContext(Context);
    if (state === null) {
      throw new Error(
        'useStore must be used within its Provider. Please wrap your component with the appropriate Provider.'
      );
    }
    return state;
  }

  return { Provider, useStore };
}

export default createContextStore;
