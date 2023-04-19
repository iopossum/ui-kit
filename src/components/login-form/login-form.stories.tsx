import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withRouter, withStores } from '@.storybook/decorators';
import { LoginForm, LoginFormMemo } from '@components/login-form';
import { success } from '@utils/api';

export default {
  title: 'Login',
  component: LoginForm,
  decorators: [withRouter, withStores],
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => <LoginForm {...args} onSubmit={() => success('submit')} />;
const TemplateMemo: ComponentStory<typeof LoginFormMemo> = (args) => (
  <LoginFormMemo {...args} onSubmit={() => success('submit')} />
);

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
