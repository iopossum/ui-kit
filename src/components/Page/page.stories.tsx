import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Page, PageMemo, IPageProps } from '@components/page';

export default {
  title: 'Page',
  component: Page,
} as Meta<typeof Page>;

const Template = (props: IPageProps) => <Page {...props} />;
const TemplateMemo = (props: IPageProps) => <PageMemo {...props} />;

export const Basic: StoryObj<typeof Page> = {
  render: Template,
  args: {}
};

export const Memo: StoryObj<typeof PageMemo> = {
  render: TemplateMemo,
  args: {}
};
