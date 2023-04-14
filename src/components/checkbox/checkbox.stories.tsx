import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Card } from '@components/card';
import { CheckBox, CheckBoxMemo } from '@components/checkbox';

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
} as ComponentMeta<typeof CheckBox>;

const Template: ComponentStory<typeof CheckBox> = (args) => {
  const [value, setValue] = useState(false);
  return <CheckBox {...args} value={value} name="name" onChange={(e) => setValue(e.target.checked)} />;
};

const TemplateMemo: ComponentStory<typeof CheckBoxMemo> = (args) => {
  const [value, setValue] = useState(false);
  return <CheckBoxMemo {...args} value={value} name="name" onChange={(e) => setValue(e.target.checked)} />;
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'asd',
  className: 'test',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  label: 'asd',
  className: 'test',
};
