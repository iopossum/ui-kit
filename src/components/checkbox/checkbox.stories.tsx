import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Card } from '@components/card';
import { CheckBox, CheckBoxMemo, ICheckBoxProps } from '@components/checkbox';

export default {
  title: 'CheckBox',
  component: CheckBox,
  decorators: [
    (Story) => (
      <Card style={{ display: 'flex', flex: 1 }}>
        <Story />
      </Card>
    ),
  ],
} as Meta<typeof CheckBox>;

const Template = (props: ICheckBoxProps) => {
  const [value, setValue] = useState(false);
  return <CheckBox {...props} value={value} name="name" onChange={(e) => setValue(e.target.checked)} />;
};

const TemplateMemo = (props: ICheckBoxProps) => {
  const [value, setValue] = useState(false);
  return <CheckBoxMemo {...props} value={value} name="name" onChange={(e) => setValue(e.target.checked)} />;
};

export const Basic: StoryObj<typeof CheckBox> = {
  render: Template,
  args: {
    label: 'asd',
    className: 'test',
  }
};

export const Memo: StoryObj<typeof CheckBoxMemo> = {
  render: TemplateMemo,
  args: {
    label: 'asd',
    className: 'test',
  }
};