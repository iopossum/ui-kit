import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Footer, FooterMemo } from '@components/footer';

export default {
  title: 'Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args}>children</Footer>;
const TemplateMemo: ComponentStory<typeof FooterMemo> = (args) => <FooterMemo {...args}>children</FooterMemo>;

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};