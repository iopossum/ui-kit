import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, oneOf, arrayOf, node, object, array, element } from 'prop-types';

export const CardContainer = ({
  className,
  style,
  direction,
  children
}) => {
  return (
    <div
      style={style}
      className={cn(
        'card__container',
        {
          [className]: !!className,
          'card__container_row': direction === 'row',
          'card__container_column': direction === 'column'
        }
      )}
    >
      { children || <div /> }
    </div>
  );
};

CardContainer.propTypesConstants = {
  direction: ['row', 'column']
};

CardContainer.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** direction */
  direction: oneOf(CardContainer.propTypesConstants.direction),
  /** children */
  children: node
};

CardContainer.defaultProps = {
  direction: 'column'
};
