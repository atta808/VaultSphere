import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import SecurityService from '../services/security/SecurityService';
import { Logger } from '../utils/logger/Logger';

const AuthenticationContext = createContext(null);

export const AuthenticationProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasPinSetup, setHasPinSetup] = useState(false);
  const isMountedRef = useRef(true);

  const checkLockState = useCallback(async () => {
    const pinSetup = await SecurityService.pin.hasPinSetup();
    if (!pinSetup) return;

    const appLockEnabled = await SecurityService.settings.isAppLockEnabled();
    const vaultLockEnabled = await SecurityService.settings.isVaultLockEnabled();

    if ((appLockEnabled || vaultLockEnabled) && !SecurityService.session.sessionActive) {
      if (isMountedRef.current) setIsLocked(true);
    }
  }, []);

  const initializeSecurity = useCallback(async () => {
    try {
      const pinSetup = await SecurityService.pin.hasPinSetup();
      if (isMountedRef.current) setHasPinSetup(pinSetup);

      const appLockEnabled = await SecurityService.settings.isAppLockEnabled();

      if (appLockEnabled && pinSetup) {
        if (isMountedRef.current) setIsLocked(true);
      } else {
        // Start a session if app lock is not enabled
        await SecurityService.session.startSession();
      }

      // Initialize session listeners for background/foreground detection
      SecurityService.session.initialize(() => {
        // Called when session times out
        checkLockState();
      });

    } catch (error) {
      Logger.error('Failed to initialize security:', error);
    } finally {
      if (isMountedRef.current) setIsInitializing(false);
    }
  }, [checkLockState]);

  useEffect(() => {
    isMountedRef.current = true;

    // Use timeout to prevent sync effect warnings
    const timeout = setTimeout(() => {
        initializeSecurity();
    }, 0);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeout);
      SecurityService.session.cleanup();
    };
  }, [initializeSecurity]);

  const unlock = async () => {
    await SecurityService.session.startSession();
    setIsLocked(false);
  };

  const lock = async () => {
    await SecurityService.session.endSession();
    setIsLocked(true);
  };

  const refreshPinSetupState = async () => {
    const pinSetup = await SecurityService.pin.hasPinSetup();
    setHasPinSetup(pinSetup);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isLocked,
        isInitializing,
        hasPinSetup,
        unlock,
        lock,
        refreshPinSetupState,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
};
