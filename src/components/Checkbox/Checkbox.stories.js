import React, { useState } from 'react';
import { Checkbox } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => {
  const [value, setValue] = useState(false);
  return (
    <Checkbox
      className={text("className", "")}
      label={text("label", "")}
      name="name"
      value={value}
      activeStateEnabled={boolean("activeStateEnabled", false)}
      focusStateEnabled={boolean("focusStateEnabled", false)}
      hoverStateEnabled={boolean("hoverStateEnabled", false)}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};


