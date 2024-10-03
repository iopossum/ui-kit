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
  const handleChange = setState;
  return <Sidebar {...props} sidebar={state} routes={routes} onChange={handleChange} />;
};

const SidebarMemoWrapper = (props: ISidebarProps) => {
  const [state, setState] = useState<TSidebarSize>('lg');
  const handleChange = setState;
  return <SidebarMemo {...props} sidebar={state} routes={routes} onChange={handleChange} />;
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
