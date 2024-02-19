import React, { memo, createElement } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { HeightAndWidthProps, Size } from 'react-virtualized-auto-sizer';

import type { IWithStyles } from '@types';

import './auto-size.scss';

export type TAutoSizeProps<T extends object = {}, K extends object = {}> = IWithStyles &
  Pick<HeightAndWidthProps, 'defaultHeight' | 'defaultWidth' | 'onResize'> &
  T & {
    component: React.FC<T & TSizePartial>;
    componentRef?: React.ForwardedRef<K>;
    renderOnZero?: boolean;
    disableHeight?: boolean;
    disableWidth?: boolean;
  };

export type TSize = Size;
export type TSizePartial = {
  autoWidth?: number;
  autoHeight?: number;
} & Pick<Partial<Size>, 'scaledHeight' | 'scaledWidth'>;

export const AutoSize = <T extends object = {}, K extends object = {}>(props: TAutoSizeProps<T, K>) => {
  const { component, renderOnZero, disableHeight, disableWidth, componentRef, ...rest } = props;

  return (
    <AutoSizer disableHeight={disableHeight as false} disableWidth={disableWidth as false} {...rest}>
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
        } as T & TSizePartial);
      }}
    </AutoSizer>
  );
};

export const AutoSizeMemo = memo(AutoSize) as typeof AutoSize;
