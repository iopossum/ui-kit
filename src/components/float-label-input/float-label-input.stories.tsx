import React, { useState, CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Card } from '@components/card';
import { FloatLabelInput, FloatLabelInputMemo, IFloatLabelInputProps } from '@components/float-label-input';

const STYLE: CSSProperties = { height: 300 };

export default {
  title: 'FloatLabelInput',
  component: FloatLabelInput,
  decorators: [
    (Story: React.FC) => (
      <Card style={STYLE}>
        <Story />
      </Card>
    ),
  ],
} as Meta<typeof FloatLabelInput>;

const Template = (props: IFloatLabelInputProps) => {
  const [value, setValue] = useState('');
  const handleChange: IFloatLabelInputProps['onChange'] = (e) => setValue(e.target.value);
  return <FloatLabelInput {...props} value={value} onChange={handleChange} />;
};

const TemplateMemo = (props: IFloatLabelInputProps) => {
  const [value, setValue] = useState('');
  const handleChange: IFloatLabelInputProps['onChange'] = (e) => setValue(e.target.value);
  return <FloatLabelInputMemo {...props} value={value} onChange={handleChange} />;
};

export const Basic: StoryObj<typeof FloatLabelInput> = {
  render: Template,
  args: {
    placeholder: 'asd',
  },
};

export const Memo: StoryObj<typeof FloatLabelInputMemo> = {
  render: TemplateMemo,
  args: {
    placeholder: 'asd',
  },
};
