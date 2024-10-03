import React, { useRef, CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@components/button';
import { Dialog, DialogMemo, IDialogProps, IDialogHandle } from '@components/dialog';

const CONTAINER_STYLE: CSSProperties = { display: 'flex', alignItems: 'flex-start' };

export default {
  title: 'Dialog',
  component: Dialog,
  decorators: [
    (Story) => (
      <div style={CONTAINER_STYLE}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Dialog>;

type Test = {
  test?: string;
};

const DialogWrapper = (props: IDialogProps) => {
  const ref = useRef<IDialogHandle<Test>>(null);
  const handleClick = async () => {
    const [error, data] = await ref.current!.open(null, { text: 'asdasd' });
    if (error) {
      alert(error.message);
    } else {
      alert(JSON.stringify(data, null, 2));
    }
  };
  return (
    <>
      <Dialog<Test> ref={ref} showSubmitButton {...props} />
      <Button text="open" onClick={handleClick} />
    </>
  );
};

const DialogMemoWrapper = (props: IDialogProps) => {
  const ref = useRef<IDialogHandle<Test>>(null);
  const handleClick = async () => {
    const data = await ref.current?.open(null, { text: 'asdasd' });
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <>
      <DialogMemo<Test> ref={ref} showSubmitButton {...props} />
      <Button text="open" onClick={handleClick} />
    </>
  );
};

const Template = (props: IDialogProps) => <DialogWrapper {...props} />;
const TemplateMemo = (props: IDialogProps) => <DialogMemoWrapper {...props} />;

export const Basic: StoryObj<typeof Dialog> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof DialogMemo> = {
  render: TemplateMemo,
  args: {},
};
