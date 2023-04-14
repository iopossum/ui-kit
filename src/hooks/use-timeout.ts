import { useRef, useEffect, useCallback } from 'react';

export const useTimeout = <T = () => void>(callback: T, delay: number | null) => {
  const savedCallback = useRef<T>(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return typeof savedCallback.current === 'function' ? savedCallback.current() : null;
    }

    const id = setTimeout(() => (typeof savedCallback.current === 'function' ? savedCallback.current() : null), delay);

    return () => clearTimeout(id);
  }, [delay]);
};

export const useTimeoutWithRef = <T>() => {
  const timeoutInstance = useRef<ReturnType<typeof setTimeout>>();

  const setTimeoutWithRef = useCallback((callback: (...args: T[]) => void, delay?: number) => {
    clearTimeout(timeoutInstance.current);
    timeoutInstance.current = setTimeout(callback, delay);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutInstance.current);
  }, []);

  return setTimeoutWithRef;
};
