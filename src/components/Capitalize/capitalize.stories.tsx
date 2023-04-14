import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Capitalize, CapitalizeMemo } from '@components/capitalize';

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
} as ComponentMeta<typeof Capitalize>;

const Template: ComponentStory<typeof Capitalize> = (args) => <Capitalize {...args} />;
const TemplateMemo: ComponentStory<typeof CapitalizeMemo> = (args) => <CapitalizeMemo {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  text: 'один два',
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  text: 'один два',
};
