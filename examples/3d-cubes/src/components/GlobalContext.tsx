import { createContext, useContext, useEffect, useState } from 'react';
import { vec3 } from 'gl-matrix';
import type { ReactNode } from 'react';

type GlobalState = {
  width: number;
  height: number;
  perspective: number;
  lightPosition: vec3;
  lightColor: string;
};

const updatePerspective = (height: number) => (500 / 750) * height;

const updateLightPosition = (width: number, height: number, v: vec3) =>
  vec3.set(v, width / 4, height / 4, 100);

const getDefaultState = (width: number, height: number): GlobalState => ({
  width,
  height,
  perspective: updatePerspective(height),
  lightPosition: updateLightPosition(width, height, vec3.create()),
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
    perspective: updatePerspective(height),
    lightPosition: updateLightPosition(width, height, state.lightPosition),
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
