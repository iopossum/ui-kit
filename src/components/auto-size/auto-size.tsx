import React, { memo, createElement, ReactNode } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { HeightAndWidthProps, Size } from 'react-virtualized-auto-sizer';

import type { IWithStyles } from '@types';

export type TAutoSizeProps<T extends object = {}, K extends object = {}> = IWithStyles &
  Pick<HeightAndWidthProps, 'defaultHeight' | 'defaultWidth' | 'onResize'> &
  T & {
    component: React.FC<T & ISizePartial>;
    componentRef?: React.ForwardedRef<K>;
    renderOnZero?: boolean;
    disableHeight?: boolean;
    disableWidth?: boolean;
  };

export interface ISize extends Size {}
export interface ISizePartial extends Pick<Partial<Size>, 'scaledHeight' | 'scaledWidth'> {
  autoWidth?: number;
  autoHeight?: number;
}

export const AutoSize = <T extends object = {}, K extends object = {}>(props: TAutoSizeProps<T, K>) => {
  const {
    component,
    renderOnZero,
    disableHeight,
    disableWidth,
    componentRef,
    defaultHeight,
    defaultWidth,
    onResize: handleResize,
    ...rest
  } = props;

  return (
    <AutoSizer
      disableHeight={disableHeight as false}
      disableWidth={disableWidth as false}
      defaultHeight={defaultHeight}
      defaultWidth={defaultWidth}
      onResize={handleResize}
    >
      {({ height, width, scaledHeight, scaledWidth }: Size) => {
        if (!renderOnZero) {
          if ((!height && !width) || (disableWidth && !height) || (disableHeight && !width)) {
            return <span />;
          }
        }
        return createElement(component, {
          ref: componentRef,
          autoWidth: width,
          autoHeight: Math.max(height || 0),
          scaledHeight,
          scaledWidth,
          ...rest,
        } as T & ISizePartial);
      }}
    </AutoSizer>
  );
};

export const AutoSizeRender = memo(
  (props: Omit<TAutoSizeProps, 'componentRef' | 'component'> & { render: (v: ISizePartial) => ReactNode }) => {
    const { renderOnZero, disableHeight, disableWidth, defaultHeight, defaultWidth, render, ...rest } = props;

    return (
      <AutoSizer
        disableHeight={disableHeight as false}
        disableWidth={disableWidth as false}
        defaultHeight={defaultHeight}
        defaultWidth={defaultWidth}
        {...rest}
      >
        {({ height, width, scaledHeight, scaledWidth }: Size) => {
          if (!renderOnZero) {
            if ((!height && !width) || (disableWidth && !height) || (disableHeight && !width)) {
              return <span />;
            }
          }
          return render({
            autoWidth: width,
            autoHeight: Math.max(height || 0),
            scaledHeight,
            scaledWidth,
          } as ISizePartial);
        }}
      </AutoSizer>
    );
  },
);

export const AutoSizeMemo = memo(AutoSize) as typeof AutoSize;
