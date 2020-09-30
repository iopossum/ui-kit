import React, { useCallback } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array, element } from 'prop-types';

import './Card.scss';

export const Card = ({
  className,
  style,
  header,
  headerComponent,
  children
}) => {
  return (
    <div style={style} className={cn('card', {[className]: !!className})}>
      { !!header || !!headerComponent ? (
        <div className="card__header">
          { header || headerComponent }
        </div>
      ) : null }
      <div className="card__body">
        { children }
      </div>
    </div>
  );
};

Card.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Заголовок */
  header: string,
  /** Заголовок (React component) */
  headerComponent: element,
  /** children */
  children: node
};

Card.defaultProps = {

};
