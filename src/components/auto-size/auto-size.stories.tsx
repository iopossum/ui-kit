import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AutoSize, AutoSizeMemo, TAutoSizeProps } from '@components/auto-size';

export default {
  title: 'AutoSize',
  component: AutoSize,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flex: 1 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof AutoSize>;

interface IBlock {
  test?: number;
}
const Block: TAutoSizeProps<IBlock>['component'] = ({ autoHeight, autoWidth, test }) => {
  return (
    <div
      style={{
        height: Math.max(autoHeight as number, 20),
        width: autoWidth,
        border: '1px solid red',
      }}
    >
      autosize {test}
    </div>
  );
};

const Template: ComponentStory<typeof AutoSize> = (args) => <AutoSize<IBlock> {...args} test={2} component={Block} />;

const TemplateMemo: ComponentStory<typeof AutoSizeMemo> = (args) => (
  <AutoSizeMemo<IBlock> {...args} test={2} component={Block} />
);

export const Basic = Template.bind({});
Basic.args = {
  disableWidth: false,
  disableHeight: false,
};

export const Memo = TemplateMemo.bind({});
Memo.args = {
  disableWidth: false,
  disableHeight: false,
};

export const Height = Template.bind({});
Height.storyName = 'Disable height';
Height.args = {
  disableHeight: true,
  disableWidth: false,
};

export const Width = Template.bind({});
Width.storyName = 'Disable width';
Width.args = {
  disableWidth: true,
};
