import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AuthWrapper, AuthWrapperMemo } from '@components/auth-wrapper';

export default {
  title: 'AuthWrapper',
  component: AuthWrapper,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof AuthWrapper>;

const Template: ComponentStory<typeof AuthWrapper> = (args) => (
  <AuthWrapper {...args}>
    контент
  </AuthWrapper>
);

const TemplateMemo: ComponentStory<typeof AuthWrapperMemo> = (args) => (
  <AuthWrapperMemo {...args}>
    контент
  </AuthWrapperMemo>
);

export const Basic = Template.bind({});
Basic.args = {
  header: 'Авторизация',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  header: 'Авторизация',
};