import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { vec3 } from 'gl-matrix';
import type { ReactNode } from 'react';

type GlobalState = {
  width: number;
  height: number;
  perspective: number;
  lightPosition: vec3;
  lightColor: string;
};

const getDefaultState = (width: number, height: number): GlobalState => ({
  width,
  height,
  perspective: (500 / 750) * height,
  lightPosition: vec3.fromValues(width / 3, height / 3, 0),
  lightColor: '#ffffff',
});

const updateGlobalStateDimensions = (
  width: number,
  height: number,
  state: GlobalState,
): GlobalState => {
  return {
    ...state,
    width,
    height,
    perspective: (500 / 750) * height,
    lightPosition: vec3.set(state.lightPosition, width / 3, height / 3, 0),
  };
};

const GlobalContext = createContext<GlobalState>(
  getDefaultState(window.innerWidth, window.innerHeight),
);

export const useGlobalContext = () => useContext<GlobalState>(GlobalContext);

type DimensionsProviderProps = {
  children: ReactNode;
};
export const GlobalStateProvider = ({ children }: DimensionsProviderProps) => {
  const [globalState, setGlobalState] = useState(() =>
    getDefaultState(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const handleResize = () => {
      setGlobalState((state) =>
        updateGlobalStateDimensions(
          window.innerWidth,
          window.innerHeight,
          state,
        ),
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};
