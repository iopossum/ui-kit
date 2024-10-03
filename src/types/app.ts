import React from 'react';
import { RouteObject } from 'react-router-dom';

type ReactText = string | number;
type ReactChild = React.ReactElement | ReactText;

type ReactNodeArray = Array<ReactNode>;
type ReactFragment = object | ReactNodeArray;

export type ReactNode = ReactChild | ReactFragment | React.ReactPortal | boolean | null | undefined;

export interface IWithStyles {
  className?: string;
  style?: React.CSSProperties;
}

export interface IRoute<T = string> extends Omit<RouteObject, 'children'> {
  path: string;
  authorization?: boolean;
  abstract?: boolean;
  roles?: T[];
  displayOnSidebar?: boolean;
  expanded?: boolean;
  children?: IRoute<T>[];
  title?: string;
  icon?: string;
  iconComponent?: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export type TTinyNumber = 0 | 1;
export enum ETinyNumber {
  FALSE = 0,
  TRUE = 1,
}
