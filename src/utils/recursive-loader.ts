import AbortController from 'abort-controller';

import { ILoadOptions, ITotalCount } from '@types';
import { IResponse } from '@utils/api';

export interface IRecursiveLoader<T> {
  queryData: ILoadOptions<T>;
  take: number;
  abortControllers?: InstanceType<typeof AbortController>[];
  load: (props: ILoadOptions<T>) => Promise<IResponse<T[]>>;
  total: (props: ILoadOptions<T>) => Promise<IResponse<ITotalCount>>;
  onPartLoad?: (items: T[]) => void;
}

export const recursiveLoader = async <T>({
  load,
  total,
  onPartLoad,
  take,
  queryData,
  abortControllers,
}: IRecursiveLoader<T>) => {
  const abortController = new AbortController();
  abortControllers?.push(abortController);
  const res = await load({ take, ...queryData, abortController });
  let totalCount = res.body?.length;
  let data = res.body;
  onPartLoad?.(data);
  if (totalCount === take) {
    const abortController = new AbortController();
    abortControllers?.push(abortController);
    const totalRes = await total({ ...queryData, abortController });
    totalCount = totalRes.body?.count;
  }
  if (totalCount > data?.length) {
    let skip = 0;
    totalCount = totalCount - take;
    while (totalCount > 0) {
      skip += take;
      const abortController = new AbortController();
      abortControllers?.push(abortController);
      const nextRes = await load({ take, skip, ...queryData, abortController });
      data = data.concat(nextRes.body);
      onPartLoad?.(data);
      totalCount = totalCount - take;
    }
  }
  return data;
};
