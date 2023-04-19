import React, { useRef } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

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
} as ComponentMeta<typeof Dialog>;

type Test = {
  test: string;
};

const DialogWrapper = (props: IDialogProps) => {
  const ref = useRef<IDialogHandle<Test>>(null);
  return (
    <>
      <Dialog<Test> ref={ref} showButtons showSubmitButton {...props} />
      <Button
        text="open"
        onClick={async () => {
          const data = await ref.current?.open({ text: 'asdasd' });
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
      <DialogMemo<Test> ref={ref} showButtons showSubmitButton {...props} />
      <Button
        text="open"
        onClick={async () => {
          const data = await ref.current?.open({ text: 'asdasd' });
          alert(JSON.stringify(data, null, 2));
        }}
      />
    </>
  );
};

const Template: ComponentStory<typeof Dialog> = (args) => <DialogWrapper {...args} />;
const TemplateMemo: ComponentStory<typeof DialogMemo> = (args) => <DialogMemoWrapper {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
