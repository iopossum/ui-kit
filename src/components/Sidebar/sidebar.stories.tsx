import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-remix-react-router';

import { routes } from '@.storybook/decorators';
import { Sidebar, SidebarMemo, TSidebarSize, ISidebarProps } from '@components/sidebar';

export default {
  title: 'Sidebar',
  component: Sidebar,
  decorators: [withRouter],
} as Meta<typeof Sidebar>;

const SidebarWrapper = (props: ISidebarProps) => {
  const [state, setState] = useState<TSidebarSize>('lg');
  return <Sidebar {...props} sidebar={state} routes={routes} onChange={setState} />;
};

const SidebarMemoWrapper = (props: ISidebarProps) => {
  const [state, setState] = useState<TSidebarSize>('lg');
  return <SidebarMemo {...props} sidebar={state} routes={routes} onChange={setState} />;
};

const Template = (props: ISidebarProps) => {
  return <SidebarWrapper {...props} />;
};
const TemplateMemo = (props: ISidebarProps) => {
  return <SidebarMemoWrapper {...props} />;
};

export const Basic: StoryObj<typeof Sidebar> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof SidebarMemo> = {
  render: TemplateMemo,
  args: {},
};
