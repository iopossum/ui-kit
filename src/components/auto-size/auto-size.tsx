import React, { forwardRef, memo, FC, createElement } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { HeightAndWidthProps, Size } from 'react-virtualized-auto-sizer';

import type { IWithStyles } from '@types';

import './auto-size.scss';

export type TAutoSizeProps<T = object> = IWithStyles &
  Omit<HeightAndWidthProps, 'children' | 'disableHeight' | 'disableWidth'> &
  T & {
    component: React.FC<T & TSizePartial>;
    renderOnZero?: boolean;
    disableHeight?: boolean;
    disableWidth?: boolean;
  };

export type TSize = Size;
export type TSizePartial = {
  autoWidth?: number;
  autoHeight?: number;
} & Pick<Partial<Size>, 'scaledHeight' | 'scaledWidth'>;

export interface IAutoSizeComponent extends FC<TAutoSizeProps<object>> {
  <T extends object>(
    props: TAutoSizeProps<T> & React.RefAttributes<AutoSizer>,
  ): ReturnType<React.ForwardRefRenderFunction<AutoSizer, TAutoSizeProps<T>>>;
}

export const AutoSize: IAutoSizeComponent = forwardRef(
  <T extends object>(props: TAutoSizeProps<T>, ref: React.ForwardedRef<AutoSizer>) => {
    const { component, renderOnZero, disableHeight, disableWidth, ...rest } = props;

    return (
      <AutoSizer disableHeight={disableHeight as false} disableWidth={disableWidth as false} {...rest}>
        {({ height, width, scaledHeight, scaledWidth }: Size) => {
          if (!renderOnZero) {
            if ((!height && !width) || (disableWidth && !height) || (disableHeight && !width)) {
              return <span />;
            }
          }
          return createElement(component, {
            ref,
            autoWidth: width,
            autoHeight: Math.max(height || 0),
            scaledHeight,
            scaledWidth,
            ...rest,
          } as T & TSizePartial);
        }}
      </AutoSizer>
    );
  },
);

export const AutoSizeMemo = memo(AutoSize) as typeof AutoSize;
