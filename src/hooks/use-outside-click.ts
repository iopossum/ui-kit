import { useEffect, useRef } from 'react';

export function useOutsideRefClick<T extends HTMLElement>(callback: (e: Event) => void) {
  const container = useRef<T>(null);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      if (container.current && e.target !== null) {
        if (!container.current.contains(e.target as Node)) {
          callback(e);
        }
      }
    };

    document.addEventListener('mousedown', handleEvent, true);
    document.addEventListener('touchstart', handleEvent, true);
    return () => {
      document.removeEventListener('mousedown', handleEvent, true);
      document.removeEventListener('touchstart', handleEvent, true);
    };
  }, [container, callback]);

  return container;
}

export function useOutsideClick<T extends HTMLElement>(element: T | null, callback: (e: Event) => void) {
  useEffect(() => {
    const handleEvent = (e: Event) => {
      if (element && e.target !== null) {
        if (!element.contains(e.target as Node)) {
          callback(e);
        }
      }
    };
    document.addEventListener('mousedown', handleEvent, true);
    document.addEventListener('touchstart', handleEvent, true);
    return () => {
      document.removeEventListener('mousedown', handleEvent, true);
      document.removeEventListener('touchstart', handleEvent, true);
    };
  }, [element, callback]);
}
