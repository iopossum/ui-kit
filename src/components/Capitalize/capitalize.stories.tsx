import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Capitalize, CapitalizeMemo, ICapitalizeProps } from '@components/capitalize';

export default {
  title: 'Capitalize',
  component: Capitalize,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flex: 1 }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Capitalize>;

const Template = (props: ICapitalizeProps) => <Capitalize {...props} />;
const TemplateMemo = (props: ICapitalizeProps) => <CapitalizeMemo {...props} />;

export const Basic: StoryObj<typeof Capitalize> = {
  render: Template,
  args: {
    text: 'один два',
  }
};

export const Memo: StoryObj<typeof CapitalizeMemo> = {
  render: TemplateMemo,
  args: {
    text: 'один два',
  }
};
