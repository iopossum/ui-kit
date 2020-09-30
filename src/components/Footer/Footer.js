import React, { useCallback } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array } from 'prop-types';

import './Footer.scss';

export const Footer = ({
  className,
  style,
  store,
  yearFrom,
  yearTo,
  children
}) => {
  const ref = useCallback(node => {
    if (node !== null && store && store.setEntity) {
      store.setEntity('footer', node);
    }
  }, []);
  return (
    <div ref={ref} style={style} className={cn('page-footer', {[className]: !!className})}>
      { children }
      © { yearFrom || Footer.defaultProps.yearFrom }-{ yearTo || Footer.defaultProps.yearTo } Все права защищены, ООО "ФАРМАСОФТ"
    </div>
  );
};

Footer.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Store. Должен присутствовать метод Store.setEntity */
  store: object,
  /** Год с*/
  yearFrom: oneOfType([string, number]),
  /** Год по*/
  yearTo: oneOfType([string, number]),
  /** children */
  children: node
};

Footer.defaultProps = {
  yearFrom: 2018,
  yearTo: new Date().getFullYear(),
};
