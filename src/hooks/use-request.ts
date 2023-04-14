import { useCallback } from 'react';

import type { IResponse } from '@utils/api';

import { useAbortController } from './use-abort-controller';
import { useMergedState } from './use-merged-state';

interface IUseRequestState<T> {
  loading: boolean;
  error: null | unknown;
  response: T;
  loaded: boolean;
}

export const useRequest = <T>(fetchFn: (...args: unknown[]) => Promise<T>) => {
  const {
    state: { loading, error, response, loaded },
    setMergedState,
  } = useMergedState<IUseRequestState<T | null>>({
    loading: false,
    error: null,
    response: null,
    loaded: false,
  });

  const { createAbortControllers } = useAbortController();

  const request = useCallback(
    async function (...args: unknown[]) {
      const ac = createAbortControllers();
      setMergedState({ loading: true, error: null, loaded: false });
      try {
        const r = await fetchFn.apply(null, [...args, ac[0]]);
        setMergedState({ loading: false, response: r, loaded: true });
        return r;
      } catch (e: unknown) {
        if (!(e as IResponse<T>).aborted) {
          setMergedState({ loading: false, error: e, loaded: true });
        }
      }
    },
    [setMergedState, fetchFn, createAbortControllers],
  );

  return {
    loading,
    error,
    response,
    request,
    loaded,
  };
};