import React from 'react';
import { Tooltip } from './index';
import { withKnobs, text, object, number, boolean, select } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [
    withKnobs,
    withInfo()
  ]
};


export const Компонент = () => (
  <Tooltip
    className={text("className", "")}
    style={object("style", {})}
    disabled={boolean("disabled", false)}
    position={select('position', Tooltip.propTypesConstants.position, Tooltip.defaultProps.position)}
    tooltipContent={text("tooltipContent", "Контент")}
  >
    тултип
  </Tooltip>
);


