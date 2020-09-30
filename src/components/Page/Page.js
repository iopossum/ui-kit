import React, { useCallback } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array } from 'prop-types';

import './Page.scss';

export const Page = ({
  className,
  style,
  children
}) => {
  return (
    <div style={style} className={cn('page', {[className]: !!className})}>
      { children }
    </div>
  );
};

Page.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** children */
  children: node
};

Page.defaultProps = {

};
