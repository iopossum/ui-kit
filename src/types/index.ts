import React from 'react';

import AbortController from 'abort-controller';

type ReactText = string | number;
type ReactChild = React.ReactElement | ReactText;

type ReactNodeArray = Array<ReactNode>;
type ReactFragment = object | ReactNodeArray;

export type ReactNode = ReactChild | ReactFragment | React.ReactPortal | boolean | null | undefined;

export interface IField<T> {
  field: keyof T;
  defaultValue: T[keyof T];
  value?: T[keyof T];
  required?: boolean;
  pattern?: RegExp;
  invalid?: boolean;
  error?: string | null;
  dirty?: boolean;
  skippable?: boolean;
  validation?: (field: IField<T>, values: T) => Promise<string | null>;
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
