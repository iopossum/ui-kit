import React, { memo, ChangeEvent } from 'react';

import { CheckBox as DxCheckbox } from 'devextreme-react/check-box';
import type { ICheckBoxOptions } from 'devextreme-react/check-box';

import type { IWithStyles } from '@types';

export interface ICheckBoxProps extends Omit<ICheckBoxOptions, 'style'>, IWithStyles {
  name: string;
  defaultValue?: boolean;
  label?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CheckBox = ({ className, label, name, elementAttr, onChange, ...rest }: ICheckBoxProps) => {
  const elementAttrs = elementAttr || {};
  if (className) {
    elementAttrs.class = className;
  }
  const handleValueChanged: ICheckBoxOptions['onValueChanged'] = (e) =>
    onChange({
      target: { name, value: e.value, checked: e.value },
    } as React.ChangeEvent<HTMLInputElement>);
  return (
    <DxCheckbox
      text={label}
      elementAttr={elementAttrs}
      activeStateEnabled
      onValueChanged={handleValueChanged}
      {...rest}
    />
  );
};

export const CheckBoxMemo = memo(CheckBox);
