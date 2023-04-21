import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Tooltip, TooltipMemo, ITooltipProps } from '@components/tooltip';

export default {
  title: 'Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>;

const Template = (props: ITooltipProps) => (
  <Tooltip placement="right" title={'qwe'} {...props}>
    <div style={{ alignSelf: 'flex-start' }}>asd</div>
  </Tooltip>
);

const TemplateMemo = (props: ITooltipProps) => (
  <TooltipMemo placement="right" title={'qwe'} {...props}>
    <div style={{ alignSelf: 'flex-start' }}>asd</div>
  </TooltipMemo>
);

export const Basic: StoryObj<typeof Tooltip> = {
  render: Template,
  args: {}
};

export const Memo: StoryObj<typeof TooltipMemo> = {
  render: TemplateMemo,
  args: {}
};
