import React, { useRef } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@components/button';
import { Dialog, DialogMemo, IDialogProps, IDialogHandle } from '@components/dialog';

export default {
  title: 'Dialog',
  component: Dialog,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
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
  return (
    <>
      <Dialog<Test> ref={ref} showSubmitButton {...props} />
      <Button
        text="open"
        onClick={async () => {
          const data = await ref.current?.open(null, { text: 'asdasd' });
          alert(JSON.stringify(data, null, 2));
        }}
      />
    </>
  );
};

const DialogMemoWrapper = (props: IDialogProps) => {
  const ref = useRef<IDialogHandle<Test>>(null);
  return (
    <>
      <DialogMemo<Test> ref={ref} showSubmitButton {...props} />
      <Button
        text="open"
        onClick={async () => {
          const data = await ref.current?.open(null, { text: 'asdasd' });
          alert(JSON.stringify(data, null, 2));
        }}
      />
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
