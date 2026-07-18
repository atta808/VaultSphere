import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Logger } from '../utils/logger/Logger';
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

  const initializeDatabase = useCallback(async (isMounted = { current: true }) => {
    try {
      if (isMounted.current) setLoading(true);
      if (isMounted.current) setError(null);

      await DatabaseService.initialize();

      // Initialize StorageService after Database is ready
      const StorageService = require('../services/vault/StorageService').default;
      await StorageService.initialize();

      if (isMounted.current) setDatabaseReady(true);
    } catch (e) {
      Logger.error('Failed to initialize DatabaseProvider:', e);
      if (isMounted.current) {
          setError(e);
          setDatabaseReady(false);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isMounted = { current: true };

    // Use a timeout to avoid sync state update in effect warning
    const timeout = setTimeout(() => {
        initializeDatabase(isMounted);
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
      // Optional cleanup on unmount
      // Note: In typical apps, we might not want to close DB on root provider unmount
      // but if needed: DatabaseService.close();
    };
  }, [initializeDatabase]);

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
