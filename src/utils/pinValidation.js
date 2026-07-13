// Constants for PIN configuration
export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 8;
export const MAX_RETRY_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes temporary lockout

export const validatePinFormat = (pin) => {
  if (!pin) return false;

  // Ensure PIN is only numbers and meets length requirements
  const isNumeric = /^\d+$/.test(pin);
  const isCorrectLength = pin.length >= PIN_MIN_LENGTH && pin.length <= PIN_MAX_LENGTH;

  return isNumeric && isCorrectLength;
};
