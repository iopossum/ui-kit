import React from 'react';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool } from 'prop-types';
import cn from 'classnames';
import './Capitalize.scss';

export const Capitalize = ({text, exact, className, style}) => {
  text = text || '';
  const split = text.split(' ');
  return (
    <div className={cn('capitalize', {[className]: !!className})} style={style}>
      { exact || text.length <= 2 ? text : `${split[0] && split[0].charAt(0) || ''}${split[1] && split[1].charAt(0) || ''}` }
    </div>
  )
};

Capitalize.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Использовать полностью */
  exact: bool,
  /** Текст */
  text: string
};

Capitalize.defaultProps = {
  exact: false,
};
