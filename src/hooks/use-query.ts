import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);
};

export const useQueryObj = <T extends object = {}>() => {
  const query = useQuery();
  const result = useMemo(() => {
    const queryObj: T = {} as T;
    for (const [key, value] of query.entries()) {
      queryObj[key as keyof T] = decodeURIComponent(value) as T[keyof T];
    }
    return {
      query,
      queryObj,
    };
  }, [query]);
  return result;
};
