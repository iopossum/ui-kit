import AbortController from 'abort-controller';
import type { LoadOptions } from 'devextreme/data/index';

export interface IAbortController {
  abortController?: InstanceType<typeof AbortController>;
}

export interface IILoopbackFilterInclude<T> {
  relation: keyof T;
  scope?: ILoopbackFilter<T>;
}

export interface ILoopbackFilter<T> {
  include?: (keyof T)[] | IILoopbackFilterInclude<T>[];
  where?: Partial<TLoopbackFilterWhere<T>> | Partial<TLoopbackFilterWhereWithCondition<T>>;
  fields?: Partial<Record<keyof T, boolean>>;
  order?: string[];
  limit?: number;
  skip?: number;
}

export interface ILoopbackWhereCondition {
  eq?: string | null;
  neq?: string | null;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  like?: string;
  nlike?: string;
  between?: string[];
  inq?: (string | number | null)[];
  regexp?: string;
}

export type TWithCondition<T> = Partial<Record<keyof T, ILoopbackWhereCondition>>;

export type TAndOr<T> =
  | Partial<T>
  | TWithCondition<T>
  | {
      and?: TAndOr<T>[];
      or?: TAndOr<T>[];
    };

export type TLoopbackFilterWhere<T> = {
  and?: TAndOr<T>[];
  or?: TAndOr<T>[];
} & Partial<T>;

export type TLoopbackFilterWhereWithCondition<T> = {
  and?: TAndOr<T>[];
  or?: TAndOr<T>[];
} & TWithCondition<T>;

export interface ILoadOptions<T> extends LoadOptions<T>, IAbortController {
  userData?: TLoopbackFilterWhere<T> | TLoopbackFilterWhereWithCondition<T>;
}

export interface ITotalCount {
  count: number;
}
