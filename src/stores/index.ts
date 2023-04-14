import { createContext, useContext } from 'react';

export const storeContext = createContext<unknown | null>(null);
export const useStores = <T>(): T => {
  const store = useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store as T;
};

export * from './app';
export * from './user';
