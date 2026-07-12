import React, { createContext, useContext, useEffect, useState } from 'react';
import DatabaseService from './services/DatabaseService';

const DatabaseContext = createContext({
  loading: true,
  databaseReady: false,
  database: null,
  error: null,
  initialize: async () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [error, setError] = useState(null);

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setError(null);

      await DatabaseService.initialize();

      setDatabaseReady(true);
    } catch (e) {
      console.error('Failed to initialize DatabaseProvider:', e);
      setError(e);
      setDatabaseReady(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeDatabase();

    return () => {
      // Optional cleanup on unmount
      // Note: In typical apps, we might not want to close DB on root provider unmount
      // but if needed: DatabaseService.close();
    };
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        loading,
        databaseReady,
        database: DatabaseService.getDatabase(),
        error,
        initialize: initializeDatabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}
