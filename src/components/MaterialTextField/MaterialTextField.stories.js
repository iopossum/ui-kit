import React, { useState } from 'react';
import { MaterialTextField } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'MaterialTextField',
  component: MaterialTextField,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => {
  const [value, setValue] = useState("");
  const required = boolean("required", false);
  return (
    <MaterialTextField
      label={text("label", "Test")}
      name="name"
      required={required}
      fullWidth={boolean("fullWidth", false)}
      hasError={!value && required}
      value={value}
      autoComplete={text("autoComplete", "")}
      autoFocus={boolean("autoFocus", true)}
      onChange={e => setValue(e.target.value)}
    />
  );
};


