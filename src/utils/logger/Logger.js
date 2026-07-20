export const Logger = {
  info: (message, data = {}) => {
    if (__DEV__) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  warn: (message, error = null) => {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, error);
    }
  },
  error: (message, error = null) => {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  debug: (message, data = {}) => {
    if (__DEV__) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
