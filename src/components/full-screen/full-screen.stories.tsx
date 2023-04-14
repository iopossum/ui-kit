
import React, { useRef } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import Button from 'devextreme-react/button';

import { FullScreen, FullScreenMemo, Zoom, IFullScreenHandle } from '@components/full-screen';

export default {
  title: 'FullScreen',
  component: FullScreen,
} as ComponentMeta<typeof FullScreen>;

const Template: ComponentStory<typeof FullScreen> = (args) => {
  const ref = useRef<IFullScreenHandle>(null);
  return (
    <div>
      <Button component={Zoom} onClick={() => ref.current?.open()} />
      <FullScreen ref={ref} {...args}>
        text
      </FullScreen>
    </div>
  );
};

const TemplateMemo: ComponentStory<typeof FullScreenMemo> = (args) => {
  const ref = useRef<IFullScreenHandle>(null);
  return (
    <div>
      <Button component={Zoom} onClick={() => ref.current?.open()} />
      <FullScreenMemo ref={ref} {...args}>
        text
      </FullScreenMemo>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};