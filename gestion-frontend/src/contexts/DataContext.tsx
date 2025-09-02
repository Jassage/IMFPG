// Contexte pour gérer l'état global des données et la synchronisation
import React, { createContext, useContext, ReactNode } from 'react';
import { useDataSync } from '../hooks/useDataSync';

interface DataContextType {
  isLoading: boolean;
  error: string | null;
  loadInitialData: () => Promise<void>;
  syncWithMongoDB: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const dataSync = useDataSync();

  return (
    <DataContext.Provider value={dataSync}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};