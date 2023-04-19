import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Card } from '@components/card';
import { FloatLabelInput, FloatLabelInputMemo } from '@components/float-label-input';

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
} as ComponentMeta<typeof FloatLabelInput>;

const Template: ComponentStory<typeof FloatLabelInput> = (args) => {
  const [value, setValue] = useState('');
  return <FloatLabelInput {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

const TemplateMemo: ComponentStory<typeof FloatLabelInputMemo> = (args) => {
  const [value, setValue] = useState('');
  return <FloatLabelInputMemo {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Basic = Template.bind({});
Basic.args = {
  placeholder: 'asd',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  placeholder: 'asd',
};
