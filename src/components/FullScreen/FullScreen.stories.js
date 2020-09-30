import React, { useState, useRef } from 'react';
import { FullScreen, Zoom } from './index';
import { withKnobs, text, object, number } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';
import Button from 'devextreme-react/button';

export default {
  title: 'FullScreen',
  component: FullScreen,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => {
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const ref = useRef();
  return (
    <React.Fragment>
      <Button component={Zoom} onClick={() => ref.current.open()} />
      <FullScreen
        ref={ref}
      >
        text
      </FullScreen>
    </React.Fragment>
  );
};
