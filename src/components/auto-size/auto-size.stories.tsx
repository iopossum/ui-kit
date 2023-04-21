import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

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
} satisfies Meta<typeof AutoSize>;

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

const Template = (props: TAutoSizeProps) => <AutoSize<IBlock> {...props} test={2} component={Block} />;
const TemplateMemo = (props: TAutoSizeProps) => <AutoSizeMemo<IBlock> {...props} test={2} component={Block} />;

export const Basic: StoryObj<typeof AutoSize> = {
  render: Template,
  args: {
    disableWidth: false,
    disableHeight: false,
  },
};

export const Memo: StoryObj<typeof AutoSizeMemo> = {
  render: TemplateMemo,
  args: {
    disableWidth: false,
    disableHeight: false,
  },
};

export const Height: StoryObj<typeof AutoSize> = {
  render: Template,
  name: 'Disable height',
  args: {
    disableWidth: false,
    disableHeight: true,
  },
};

export const Width: StoryObj<typeof AutoSize> = {
  render: Template,
  name: 'Disable width',
  args: {
    disableWidth: true,
    disableHeight: false,
  },
};
