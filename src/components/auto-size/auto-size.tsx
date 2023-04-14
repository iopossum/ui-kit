import React, { forwardRef, memo, FC, createElement } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { Props as AutoSizerProps, Size } from 'react-virtualized-auto-sizer';

import type { IWithStyles } from '@types';

import './auto-size.scss';

export type TAutoSizeProps<T = object> = IWithStyles &
  Omit<AutoSizerProps, 'children'> &
  T & {
    component: React.FC<T & TSizePartial>;
    renderOnZero?: boolean;    
  };

export type TSize = Size;
export type TSizePartial = {
  autoWidth?: number;
  autoHeight?: number;
};

export interface IAutoSizeComponent extends FC<TAutoSizeProps<object>> {
  <T extends object>(props: TAutoSizeProps<T> & React.RefAttributes<AutoSizer>): ReturnType<
    React.ForwardRefRenderFunction<AutoSizer, TAutoSizeProps<T>>
  >;
}

export const AutoSize: IAutoSizeComponent = forwardRef(
  <T extends object>(props: TAutoSizeProps<T>, ref: React.ForwardedRef<AutoSizer>) => {
    const { component, renderOnZero, ...rest } = props;

    return (
      <AutoSizer {...rest}>
        {({ height, width }) => {
          if (!renderOnZero) {
            if ((!height && !width) || (props.disableWidth && !height) || (props.disableHeight && !width)) {
              return <span />;
            }
          }          
          return createElement(component, {
            ref,
            autoWidth: width,
            autoHeight: Math.max(height || 0),
            ...rest,
          } as T & TSizePartial);
        }}
      </AutoSizer>
    );
  },
);

AutoSize.defaultProps = {
  disableWidth: true,
};

export const AutoSizeMemo = memo(AutoSize) as typeof AutoSize;
