import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonMemo, IButtonProps } from '@components/button';
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
} as Meta<typeof Button>;

const Template = (props: IButtonProps) => <Button height={'30px'} {...props} />;
const TemplateMemo = (props: IButtonProps) => <ButtonMemo height={'30px'} {...props} allowLoading={false} />;

export const Basic: StoryObj<typeof Button> = {
  render: Template,
  args: {
    text: 'Кнопка',
  },
};

export const Memo: StoryObj<typeof ButtonMemo> = {
  render: TemplateMemo,
  args: {
    text: 'Кнопка',
  },
};

export const Texts: StoryObj<typeof Button> = {
  render: Template,
  name: 'Loading',
  args: {
    loading: true,
    texts: ['Кнопка', 'Кнопка...'],
  },
};
