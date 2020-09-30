import React, { useCallback, useState, useRef } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, oneOf, arrayOf, node, object, array, bool, element } from 'prop-types';
import { useTooltip } from '@hooks';
import { Tooltip as DevextremeTooltip } from 'devextreme-react/tooltip';

import './Tooltip.scss';

export const Tooltip = ({
  className,
  style,
  id: propsId,
  disabled,
  position,
  tooltipContent,
  children
}) => {
  const [id] = useState(`tooltip-${propsId || (Math.random() * 1000000000000000000).toFixed(0)}`);
  const {
    onMouseEnter,
    onMouseLeave,
    visible
  } = useTooltip({ disabled });
  return (
    <React.Fragment>
      <div
        style={style}
        className={cn({[className]: !!className})}
        id={id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        { children }
      </div>
      <DevextremeTooltip
        target={`#${id}`}
        position={position}
        visible={visible}
      >
        {tooltipContent}
      </DevextremeTooltip>
    </React.Fragment>
  );
};

Tooltip.propTypesConstants = {
  position: ['top', 'bottom', 'left', 'right']
};

Tooltip.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** id (не обяз) */
  id: string,
  /** Disabled */
  disabled: bool,
  /** Position */
  position: oneOf(Tooltip.propTypesConstants.position),
  /** Контент */
  tooltipContent: oneOfType([element, string]).isRequired,
  /** children */
  children: node
};

Tooltip.defaultProps = {
  position: 'top',
  disabled: false
};
