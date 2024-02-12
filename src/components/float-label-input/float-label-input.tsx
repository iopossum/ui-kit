import React, { useState, memo } from 'react';

import { Input } from 'antd';
import type { InputProps } from 'antd';
import cn from 'classnames';

import type { IWithStyles } from '@types';

import './float-label-input.scss';

export interface IFloatLabelInputProps extends Omit<InputProps, 'placeholder'>, IWithStyles {
  placeholder?: string;
  label?: string;
  fullWidth?: boolean;
}

export const FloatLabelInput = (props: IFloatLabelInputProps) => {
  const { value, label, fullWidth, placeholder, ...rest } = props;

  const [focus, setFocus] = useState(false);

  const isOccupied = focus || value?.toString().length !== 0;

  const required = rest.required ? <span className="required">*</span> : null;

  return (
    <div
      className={cn(['float-label', rest.size, rest.status], {
        focused: isOccupied,
        'full-width': fullWidth,
      })}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <label>
        {label || placeholder}
        {required}
      </label>
      <div className="input-container">
        <Input variant="borderless" value={value} {...rest} />
        <fieldset>
          <legend>
            <span>
              {label || placeholder}
              {required}
            </span>
          </legend>
        </fieldset>
      </div>
    </div>
  );
};

FloatLabelInput.defaultProps = {
  type: 'text',
};

export const FloatLabelInputMemo = memo(FloatLabelInput);
