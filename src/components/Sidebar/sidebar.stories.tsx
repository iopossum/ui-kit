import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { withRouter, routes } from '@.storybook/decorators';
import { Sidebar, SidebarMemo, TSidebarSize, ISidebarProps } from '@components/sidebar';

export default {
  title: 'Sidebar',
  component: Sidebar,
  decorators: [
    withRouter
  ]
} as ComponentMeta<typeof Sidebar>;

const SidebarWrapper = (props: ISidebarProps) => {
  const [state, setState] = useState<TSidebarSize>('lg');
  return (
    <Sidebar
      {...props}
      sidebar={state}
      routes={routes}
      onChange={setState}
    />
  )
}

const SidebarMemoWrapper = (props: ISidebarProps) => {
  const [state, setState] = useState<TSidebarSize>('lg');
  return (
    <SidebarMemo
      {...props}
      sidebar={state}
      routes={routes}
      onChange={setState}
    />
  )
}

const Template: ComponentStory<typeof Sidebar> = (args) => {  
  return (
    <SidebarWrapper
      {...args}
    />
  )
};
const TemplateMemo: ComponentStory<typeof SidebarMemo> = (args) => {  
  return (
    <SidebarMemoWrapper
      {...args}
    />
  )
};

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};