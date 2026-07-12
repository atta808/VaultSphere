import React, { createContext } from 'react';

export const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  return (
    <VaultContext.Provider value={{}}>
      {children}
    </VaultContext.Provider>
  );
};
