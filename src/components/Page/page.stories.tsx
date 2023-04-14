import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Page, PageMemo } from '@components/page';

export default {
  title: 'Page',
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;
const TemplateMemo: ComponentStory<typeof PageMemo> = (args) => <PageMemo {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
