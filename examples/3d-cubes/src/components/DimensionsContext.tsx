import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type DimensionsState = {
  width: number;
  height: number;
  perspective: number;
};

const getDimensionsState = (
  width: number,
  height: number,
): DimensionsState => ({
  width,
  height,
  perspective: (500 / 750) * height,
});

const DimensionsContext = createContext<DimensionsState>(
  getDimensionsState(window.innerWidth, window.innerHeight),
);

export const useDimensionsContext = () =>
  useContext<DimensionsState>(DimensionsContext);

type DimensionsProviderProps = {
  children: ReactNode;
};
export const DimensionsProvider = ({ children }: DimensionsProviderProps) => {
  const [dimensionsState, setDimensionsState] = useState(() =>
    getDimensionsState(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const handleResize = () => {
      setDimensionsState(
        getDimensionsState(window.innerWidth, window.innerHeight),
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DimensionsContext.Provider value={dimensionsState}>
      {children}
    </DimensionsContext.Provider>
  );
};
