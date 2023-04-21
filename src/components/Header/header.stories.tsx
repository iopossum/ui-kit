import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Header, HeaderMemo, IHeaderProps } from '@components/header';

export default {
  title: 'Header',
  component: Header,
} as Meta<typeof Header>;

const Template = (props: IHeaderProps) => <Header {...props} />;
const TemplateMemo = (props: IHeaderProps) => <HeaderMemo {...props} />;

export const Basic: StoryObj<typeof Header> = {
  render: Template,
  args: {}
};

export const Memo: StoryObj<typeof HeaderMemo> = {
  render: TemplateMemo,
  args: {}
};
