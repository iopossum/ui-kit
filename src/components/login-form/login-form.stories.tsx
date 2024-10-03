import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-remix-react-router';

import { LoginForm, LoginFormMemo, ILoginFormProps } from '@components/login-form';
import { success } from '@utils/api';

export default {
  title: 'Login',
  component: LoginForm,
  decorators: [withRouter],
} as Meta<typeof LoginForm>;

const handleSubmit = () => success('submit');

const Template = (props: ILoginFormProps) => <LoginForm {...props} onSubmit={handleSubmit} />;
const TemplateMemo = (props: ILoginFormProps) => <LoginFormMemo {...props} onSubmit={handleSubmit} />;

export const Basic: StoryObj<typeof LoginForm> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof LoginFormMemo> = {
  render: TemplateMemo,
  args: {},
};
