import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Footer, FooterMemo, IFooterProps } from '@components/footer';

export default {
  title: 'Footer',
  component: Footer,
} as Meta<typeof Footer>;

const Template = (props: IFooterProps) => <Footer {...props}>children</Footer>;
const TemplateMemo = (props: IFooterProps) => <FooterMemo {...props}>children</FooterMemo>;

export const Basic: StoryObj<typeof Footer> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof FooterMemo> = {
  render: TemplateMemo,
  args: {},
};
