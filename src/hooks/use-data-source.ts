import { useRef } from 'react';

import type { LoadOptions } from 'devextreme/data';
import CustomStore from 'devextreme/data/custom_store';
import type { Options as CustomStoreOptions, ResolvedData } from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import type { Options as DataSourceOptions } from 'devextreme/data/data_source';

import { useAbortController } from '@hooks/use-abort-controller';
import type { IAbortController } from '@types';

export interface IUseDataSourceProps<T extends object = {}, TKey = unknown>
  extends Omit<CustomStoreOptions<T, TKey>, 'load' | 'byKey'>,
    DataSourceOptions<T> {
  tableKey?: keyof T;
  abortLoad?: boolean;
  abortByKey?: boolean;
  abortUpdate?: boolean;
  abortInsert?: boolean;
  abortRemove?: boolean;
  load: (e: LoadOptions<T> & IAbortController) => ResolvedData;
  byKey?: (e: TKey, config?: LoadOptions<T> & IAbortController) => PromiseLike<T>;
}

export const useDataSource = <T extends object = {}, TKey = unknown>({
  tableKey,
  abortLoad = true,
  abortByKey = true,
  abortInsert,
  abortUpdate,
  abortRemove,
  loadMode = 'processed',
  load,
  insert,
  update,
  remove,
  byKey,
  ...rest
}: IUseDataSourceProps<T, TKey>) => {
  const { createAbortControllers } = useAbortController();

  const dataSource = useRef(
    new DataSource<T, TKey>({
      loadMode,
      store: new CustomStore<T, TKey>({
        key: tableKey as string,
        ...rest,
        loadMode,
        load: (props) => {
          if (!abortLoad) {
            return load(props);
          }
          const ac = createAbortControllers();
          return load({ ...props, abortController: ac[0] });
        },
        insert: insert
          ? function (props) {
              if (!abortInsert) {
                return insert?.(props);
              }
              const ac = createAbortControllers();
              return insert({ ...props, abortController: ac[0] });
            }
          : insert,
        update: update
          ? (key, value) => {
              if (!abortUpdate) {
                return update(key, value);
              }
              const ac = createAbortControllers();
              return update(key, { ...value, abortController: ac[0] });
            }
          : update,
        remove: remove
          ? (props) => {
              if (!abortRemove) {
                return remove(props);
              }
              const ac = createAbortControllers();
              return remove({ ...props, abortController: ac[0] });
            }
          : remove,
        byKey: byKey
          ? (props) => {
              if (!abortByKey) {
                return byKey(props);
              }
              const ac = createAbortControllers();
              return byKey(props, { abortController: ac[0] });
            }
          : byKey,
      }),
      ...rest,
    }),
  );

  return dataSource.current;
};
