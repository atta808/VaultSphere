import { useState, useEffect } from 'react';

/**
 * A hook for debouncing search input to prevent spamming backend services.
 * @param {string} value - The input value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {string} The debounced value.
 */
export function useDebouncedSearch(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
