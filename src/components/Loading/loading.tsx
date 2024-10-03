import React, { memo } from 'react';
import type { BaseProps } from 'react-loader-spinner';
import * as ReactLoaderSpinner from 'react-loader-spinner';

import cn from 'classnames';

import type { IWithStyles } from '@types';

import './loading.scss';

export interface ILoadingAttrs extends BaseProps {
  type: keyof typeof ReactLoaderSpinner;
  global?: boolean;
}

export const LOADING_GLOBAL_PROPS: ILoadingAttrs = {
  type: 'BallTriangle',
  height: 100,
  width: 100,
  global: true,
};

export interface ILoadingProps extends Partial<ILoadingAttrs>, IWithStyles {}

export const Loading = ({ className, style, type = 'TailSpin', global, ...rest }: ILoadingProps) => {
  const styleObj = style ? { ...style } : {};
  if (global) {
    styleObj.position = 'fixed';
  }
  const Spinner = (ReactLoaderSpinner as Record<string, unknown>)[type as string] as React.FC<BaseProps>;
  return (
    <div className={`${className || 'loading'}`} style={styleObj}>
      <Spinner color="#bf4e6a" height={40} width={40} {...rest} />
    </div>
  );
};

export const LoadingMemo = memo(Loading);

export interface ILoadingContainerProps extends IWithStyles {
  loading?: boolean;
  children?: React.ReactNode;
}

export const LoadingContainer = ({ className, style, loading, children }: ILoadingContainerProps) => {
  return (
    <div
      className={cn('loading-container', {
        [className as string]: !!className,
      })}
      style={style}
    >
      {loading ? <Loading /> : null}
      {children}
    </div>
  );
};

export const LoadingContainerMemo = memo(LoadingContainer);
