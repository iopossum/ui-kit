import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button, ButtonMemo } from '@components/button';
import { Card } from '@components/card';

export default {
  title: 'Button',
  component: Button,
  decorators: [
    (Story) => (
      <Card style={{ display: 'flex', flex: 1 }}>
        <Story />
      </Card>
    ),
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button height={'30px'} {...args} />;
const TemplateMemo: ComponentStory<typeof ButtonMemo> = (args) => <ButtonMemo height={'30px'} {...args} />;

export const Basic = Template.bind({});
Basic.storyName = 'Basic';
Basic.args = {
  text: 'Кнопка',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  text: 'Кнопка',
};

export const Texts = Template.bind({});
Texts.storyName = 'Loading';
Texts.args = {
  loading: true,
  texts: ['Кнопка', 'Кнопка...'],
};
