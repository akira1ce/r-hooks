import { useContext, createContext, ReactNode, memo, useMemo } from 'react';

export interface Store<T> {
  Provider: React.FC<ProviderProps>;
  useStore: () => T;
}

interface ProviderProps {
  children?: ReactNode;
}

export type Hook<State, Params = void> = (params?: Params) => State;

function useContextStore<State, Params = void>(
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

export default useContextStore;
