import React from 'react';
import { Header } from './index';
import { withKnobs, text, object, number } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Header',
  component: Header,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Header
    className={text("className", "")}
    style={object("style", {})}
    children={text("children", "")}
    userComponent={<div>{text("userComponent", "Иванов Иван Иванович")}</div>}
  />
);


