import React, { useState, CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Card } from '@components/card';
import { CheckBox, CheckBoxMemo, ICheckBoxProps } from '@components/checkbox';

const CONTAINER_STYLE: CSSProperties = { display: 'flex', flex: 1 };

export default {
  title: 'CheckBox',
  component: CheckBox,
  decorators: [
    (Story) => (
      <Card style={CONTAINER_STYLE}>
        <Story />
      </Card>
    ),
  ],
} as Meta<typeof CheckBox>;

const Template = (props: ICheckBoxProps) => {
  const [value, setValue] = useState(false);
  const handleChange: ICheckBoxProps['onChange'] = (e) => setValue(e.target.checked);
  return <CheckBox {...props} value={value} name="name" onChange={handleChange} />;
};

const TemplateMemo = (props: ICheckBoxProps) => {
  const [value, setValue] = useState(false);
  const handleChange: ICheckBoxProps['onChange'] = (e) => setValue(e.target.checked);
  return <CheckBoxMemo {...props} value={value} name="name" onChange={handleChange} />;
};

export const Basic: StoryObj<typeof CheckBox> = {
  render: Template,
  args: {
    label: 'asd',
    className: 'test',
  },
};

export const Memo: StoryObj<typeof CheckBoxMemo> = {
  render: TemplateMemo,
  args: {
    label: 'asd',
    className: 'test',
  },
};
