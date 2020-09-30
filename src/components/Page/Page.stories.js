import React from 'react';
import { Page } from './index';
import { withKnobs, text, object, number } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Page',
  component: Page,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Page
    className={text("className", "")}
    style={object("style", {})}
    children={text("children", "")}
  />
);


