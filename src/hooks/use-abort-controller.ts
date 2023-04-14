import React, { useRef, useCallback, useEffect } from 'react';

import AbortController from 'abort-controller';

interface IUseAbortController {
  (props?: { initCount?: number; abortOnUnmount?: boolean }): {
    createAbortControllers: (e?: { count?: number }) => InstanceType<typeof AbortController>[];
    abortControllersRef: React.MutableRefObject<InstanceType<typeof AbortController>[]>;
  };
}

export const useAbortController: IUseAbortController = ({ initCount, abortOnUnmount = true } = {}) => {
  const abortControllersRef = useRef(
    initCount && initCount > 0 ? Array.from({ length: initCount }).map(() => new AbortController()) : [],
  );

  useEffect(() => {
    return () => {
      abortOnUnmount && abortControllersRef.current.forEach((v) => v.abort());
    };
  }, [abortOnUnmount]);

  const createAbortControllers = useCallback(({ count }: { count?: number } = {}) => {
    const array = Array.from({ length: count || 1 }).map(() => new AbortController());
    abortControllersRef.current = abortControllersRef.current.concat(array);
    return array;
  }, []);

  return { abortControllersRef, createAbortControllers };
};