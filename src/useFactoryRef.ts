import { useRef, useMemo } from 'react';

export const useFactoryRef = <T>(factory: () => T) => {
  // deliberately only run factory function once on mount
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const initialValue = useMemo<T>(factory, []);
  return useRef<T>(initialValue);
};
