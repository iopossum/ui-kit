import React, { useRef } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import Button from 'devextreme-react/button';

import { FullScreen, FullScreenMemo, Zoom, IFullScreenHandle, IFullScreenProps } from '@components/full-screen';

export default {
  title: 'FullScreen',
  component: FullScreen,
} as Meta<typeof FullScreen>;

const Template = (props: IFullScreenProps) => {
  const ref = useRef<IFullScreenHandle>(null);
  const handleOpen = () => ref.current?.open();
  return (
    <div>
      <Button component={Zoom} onClick={handleOpen} />
      <FullScreen ref={ref} {...props}>
        text
      </FullScreen>
    </div>
  );
};

const TemplateMemo = (props: IFullScreenProps) => {
  const ref = useRef<IFullScreenHandle>(null);
  const handleOpen = () => ref.current?.open();
  return (
    <div>
      <Button component={Zoom} onClick={handleOpen} />
      <FullScreenMemo ref={ref} {...props}>
        text
      </FullScreenMemo>
    </div>
  );
};

export const Basic: StoryObj<typeof FullScreen> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof FullScreenMemo> = {
  render: TemplateMemo,
  args: {},
};
