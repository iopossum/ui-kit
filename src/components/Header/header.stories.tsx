import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Header, HeaderMemo } from '@components/header';

export default {
  title: 'Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;
const TemplateMemo: ComponentStory<typeof HeaderMemo> = (args) => <HeaderMemo {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};