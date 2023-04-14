import { useState } from 'react';

export const useMergedState = <T>(initialState: T | (() => T) = {} as T) => {
  const [state, setState] = useState<T>(initialState);
  const setMergedState = (newState: Partial<T>) => setState((prevState) => Object.assign({}, prevState, newState));
  return { state, setMergedState };
};