import React, { useCallback, useState, useRef, memo } from 'react';
import { string, number, oneOfType, oneOf, arrayOf, node, object, array, bool, element } from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import cn from 'classnames';
import { Tabs } from '@components/Tabs';


export const TabsAutosize = ({
  className,
  style,
  ...props
}) => {
  return (
    <AutoSizer
      disableWidth
      className={cn('tabs_autosize', {[className]: !!className})}
      style={Object.assign({ height: '100%' }, style)}
    >
      {({ height }) => {
        return height > 0 ? <Tabs {...props} height={height} /> : null;
      }}
    </AutoSizer>
  );
};

TabsAutosize.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** tabs */
  tabs: array,
  /** tabContentPadding */
  tabContentPadding: number,
  /** tabContentMinHeight */
  tabContentMinHeight: number,
  /** tabContentDefaultMaxHeight */
  tabContentDefaultMaxHeight: number,
  /** storageName */
  storageName: string,
};

TabsAutosize.defaultProps = {
  tabs: [],
  storageName: 'tab',
  tabContentPadding: 10,
  tabContentMinHeight: 200,
  tabContentDefaultMaxHeight: 300
};
