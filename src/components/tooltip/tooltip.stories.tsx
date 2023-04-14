import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Tooltip, TooltipMemo } from '@components/tooltip';

export default {
  title: 'Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip placement='right' title={'qwe'} {...args} >
    <div style={{ alignSelf: 'flex-start' }}>asd</div>
  </Tooltip>
);

const TemplateMemo: ComponentStory<typeof TooltipMemo> = (args) => (
  <TooltipMemo placement='right' title={'qwe'} {...args} >
    <div style={{ alignSelf: 'flex-start' }}>asd</div>
  </TooltipMemo>
);

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
