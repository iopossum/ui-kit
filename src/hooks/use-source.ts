import { useCallback, useEffect, useState, useMemo } from 'react';

import { IResponseError } from '@utils/api';

interface IOptions {
  lazy?: boolean;
}

export const useSource = <T>(query: () => Promise<T>, deps?: unknown[], options?: IOptions) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<IResponseError>();
  const [loading, setLoading] = useState(false);

  const { lazy } = options || {};

  const clear = useCallback(() => {
    setData(undefined);
    setError(undefined);
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);

    let res = null;
    try {
      res = await query();
      setData(res);
    } catch (e) {
      setError(e as IResponseError);
    }
    setLoading(false);
    return res;
  }, [query]);

  const actions = useMemo(() => ({ fetch, clear }), [fetch, clear]);

  useEffect(() => {
    if (!lazy) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, ...(deps || [])]);

  return [{ error, loading, data }, actions] as const;
};
