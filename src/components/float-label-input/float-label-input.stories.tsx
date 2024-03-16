import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Card } from '@components/card';
import { FloatLabelInput, FloatLabelInputMemo, IFloatLabelInputProps } from '@components/float-label-input';

export default {
  title: 'FloatLabelInput',
  component: FloatLabelInput,
  decorators: [
    (Story: React.FC) => (
      <Card style={{ height: 300 }}>
        <Story />
      </Card>
    ),
  ],
} as Meta<typeof FloatLabelInput>;

const Template = (props: IFloatLabelInputProps) => {
  const [value, setValue] = useState('');
  return <FloatLabelInput {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

const TemplateMemo = (props: IFloatLabelInputProps) => {
  const [value, setValue] = useState('');
  return <FloatLabelInputMemo {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
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
