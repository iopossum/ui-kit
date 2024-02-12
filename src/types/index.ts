import React from 'react';
import { RegisterOptions } from 'react-hook-form';

import AbortController from 'abort-controller';
import type { LoadOptions } from 'devextreme/data';

type ReactText = string | number;
type ReactChild = React.ReactElement | ReactText;

type ReactNodeArray = Array<ReactNode>;
type ReactFragment = object | ReactNodeArray;

export type ReactNode = ReactChild | ReactFragment | React.ReactPortal | boolean | null | undefined;

export interface IField<T> {
  field: keyof T;
  defaultValue: T[keyof T];
  value?: T[keyof T];
  pattern?: RegExp;
  invalid?: boolean;
  error?: string | null;
  dirty?: boolean;
  skippable?: boolean;
  validation?: (field: IField<T>, values: T) => Promise<string | null>;
  rules?: RegisterOptions;
}

export interface IWithStyles {
  className?: string;
  style?: React.CSSProperties;
}

export interface IAbortController {
  abortController?: InstanceType<typeof AbortController>;
}

export interface IRoute {
  path: string;
  authorization?: boolean;
  roles?: string[];
  displayOnSidebar?: boolean;
  expanded?: boolean;
  children?: IRoute[];
  title?: string;
  icon?: string;
  iconComponent?: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface ILoopbackFilter<T> {
  where?: Partial<TLoopbackFilterWhere<T>> | Partial<TLoopbackFilterWhereWithCondition<T>>;
  fields?: Partial<Record<keyof T, boolean>>;
  limit?: number;
  skip?: number;
}

export interface ILoopbackWhereCondition {
  eq?: string | number;
  gte?: string;
  lt?: string;
  between?: string[];
  inq?: (string | number | null)[];
  regexp?: string;
}

type TWithCondition<T> = Partial<{ [K in keyof T]: ILoopbackWhereCondition }>;

type TAndOr<T> =
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
