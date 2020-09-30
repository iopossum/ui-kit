import React, { useEffect, forwardRef } from 'react';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, element } from 'prop-types';
import cn from 'classnames';
import { AutoSizer } from 'react-virtualized';

import './Autosize.scss';

export const Autosize = forwardRef(({
  className,
  style,
  disableWidth,
  disableHeight,
  renderOnZero,
  delta,
  component,
  ...props
}, ref) => {
  return (
    <AutoSizer
      disableWidth={disableWidth}
      disableHeight={disableHeight}
      className={cn({[className]: !!className})}
      style={style}
    >
      {({ height, width }) => {
        if (!renderOnZero) {
          if (!height && !width || disableWidth && !height || disableHeight && !width) {
            return null;
          }
        }
        if (props.width && !width) {
          width = props.width;
        }
        return React.createElement(component, {...props, width, ref, height: height - (delta || 0)});
      }}
    </AutoSizer>
  )
});

Autosize.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** disableWidth */
  disableWidth: bool,
  /** disableHeight */
  disableHeight: bool,
  /** renderOnZero */
  renderOnZero: bool,
  /** погрешность */
  delta: number,
  /** component */
  component: oneOfType([object, func]).isRequired
};

Autosize.defaultProps = {
  disableWidth: true,
  disableHeight: false,
  renderOnZero: false,
  delta: 2
};
