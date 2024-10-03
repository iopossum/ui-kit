import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { AuthWrapper, AuthWrapperMemo, IAuthWrapperProps } from '@components/auth-wrapper';

export default {
  title: 'AuthWrapper',
  component: AuthWrapper,
} satisfies Meta<typeof AuthWrapper>;

const Template = (props: IAuthWrapperProps) => <AuthWrapper {...props}>контент</AuthWrapper>;
const TemplateMemo = (props: IAuthWrapperProps) => <AuthWrapperMemo {...props}>контент</AuthWrapperMemo>;

export const Basic: StoryObj<typeof AuthWrapper> = {
  render: Template,
  args: {
    header: 'Авторизация',
  },
};

export const Memo: StoryObj<typeof AuthWrapperMemo> = {
  render: TemplateMemo,
  args: {
    header: 'Авторизация',
  },
};
