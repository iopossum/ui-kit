import React, { useCallback } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, element, node, object, array, func, bool } from 'prop-types';

import './Header.scss';

export const Header = ({
  className,
  style,
  children,
  onSearch,
  showSearch,
  showUser,
  userComponent
}) => {
  return (
    <div style={style} className={cn('header', {[className]: !!className, 'header_no-children': !children})}>
      { children }
      { showUser && userComponent }
    </div>
  );
};

Header.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** children */
  children: node,
  /** onSearch callback*/
  onSearch: func,
  /** Показывать поиск */
  showSearch: bool,
  /** Показывать имя пользователя */
  showUser: bool,
  /** Username component */
  userComponent: oneOfType([string, element]),
};

Header.defaultProps = {
  showSearch: false,
  showUser: true
};
