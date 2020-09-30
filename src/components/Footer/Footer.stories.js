import React from 'react';
import { Footer } from './index';
import { withKnobs, text, object, number } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Footer',
  component: Footer,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Footer
    yearFrom={number("yearFrom", 2018)}
    yearTo={number("yearTo", 2020)}
    className={text("className", "")}
    style={object("style", {})}
    children={text("children", "")}
  />
);


