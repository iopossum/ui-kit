import React, { createContext, useContext } from 'react';

export const storeContext = createContext(null);
export const useStores = () => {
  const store = useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
};

export * from './AppStore';
export * from './UserStore';
