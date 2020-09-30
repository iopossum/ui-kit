import React, { useEffect } from 'react';
import { Autosize } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'Autosize',
  component: Autosize,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

const a = ({ height }) => {
  return <div style={{ height: height - 2, width: 50, border: '1px solid red' }}>autosize</div>;
};

export const Компонент = () => (
  <Autosize
    disableWidth={boolean('disableWidth', Autosize.defaultProps.disableWidth)}
    disableHeight={boolean('disableHeight', Autosize.defaultProps.disableHeight)}
    renderOnZero={boolean('renderOnZero', Autosize.defaultProps.renderOnZero)}
    component={a}
  />
);


