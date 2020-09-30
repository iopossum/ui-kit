import React from 'react';
import { Button } from './index';
import { withKnobs, text, object, number, boolean, array, select } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Button',
  component: Button,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => (
  <Button
    loading={boolean("loading", false)}
    text={text("text", "Кнопка")}
    texts={array("texts", ['Кнопка', 'Кнопка...'])}
    type={select('type', Button.propTypesConstants.type, Button.defaultProps.type)}
    stylingMode={select('stylingMode', Button.propTypesConstants.stylingMode, Button.defaultProps.stylingMode)}
    hint={text("hint", "")}
    disabled={boolean("disabled", false)}
    className={text("className", "")}
    style={object("style", {})}
  />
);


