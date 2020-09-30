import React from 'react';
import { Capitalize } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Capitalize (Преобразование слов по первым буквам)',
  component: Capitalize,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Capitalize
    exact={boolean("exact", false)}
    text={text("text", "Один два")}
    className={text("className", "")}
    style={object("style", {})}
  />
);


