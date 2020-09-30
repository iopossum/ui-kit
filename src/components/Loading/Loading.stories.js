import React from 'react';
import { Loading, LoadingContainer } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Loading',
  component: Loading,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Loading
    className={text("className", "")}
    style={object("style", {})}
    type={text("type", "TailSpin")}
    color={text("color", "#bf4e6a")}
    height={number("height", 40)}
    width={number("width", 40)}
    global={boolean("global", false)}
  />
);

export const Container = () => (
  <LoadingContainer
    className={text("className", "")}
    style={object("style", {})}
    children={text("children", "")}
    loading={boolean("loading", false)}
  />
);

