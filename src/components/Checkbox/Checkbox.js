import React, { useCallback } from 'react';
import { string, number, oneOfType, element, node, object, array, func, bool } from 'prop-types';
import { CheckBox as DevextremeCheckbox } from 'devextreme-react/check-box';

import './Checkbox.scss';

export const Checkbox = ({
  className,
  value,
  label,
  name,
  activeStateEnabled,
  focusStateEnabled,
  hoverStateEnabled,
  onChange,
}) => {
  return (
    <DevextremeCheckbox
      value={value}
      text={label}
      elementAttr={{
        class: className
      }}
      activeStateEnabled={activeStateEnabled}
      focusStateEnabled={focusStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      onValueChanged={(e) => onChange({ target: { name, value: e.value } })}
    />
  );
};

Checkbox.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Value */
  value: bool,
  /** Label */
  label: string,
  /** Name (field) */
  name: string.isRequired,
  /** activeStateEnabled */
  activeStateEnabled: bool,
  /** focusStateEnabled */
  focusStateEnabled: bool,
  /** hoverStateEnabled */
  hoverStateEnabled: bool,
  /** onChange callback*/
  onChange: func,
};

Checkbox.defaultProps = {
  className: '',
  activeStateEnabled: true,
  focusStateEnabled: false,
  hoverStateEnabled: false,
  onChange: () => {}
};
