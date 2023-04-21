import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { TabPanel, TabPanelMemo } from '@components/tab-panel';
import type { ITabPanelItemProps, ITabPanelProps } from '@components/tab-panel';

export default {
  title: 'TabPanel',
  component: TabPanel,
} as Meta<typeof TabPanel>;

type Test = {
  test: string;
};

const TabComponent: ITabPanelItemProps<Test>['component'] = ({ padding, minHeight, maxHeight }) => {
  return (
    <div
      style={{
        border: '1px solid red',
        padding,
        minHeight,
        maxHeight,
        height: maxHeight,
      }}
    >
      {JSON.stringify({ padding, minHeight, maxHeight })}
    </div>
  );
};

const tabs: ITabPanelItemProps<Test>[] = [
  {
    title: 'Tab 1',
    component: (props) => (
      <div>
        Tab 1 <TabComponent {...props} />
      </div>
    ),
  },
  {
    title: 'Tab 2',
    component: (props) => (
      <div>
        Tab 2 <TabComponent {...props} />
      </div>
    ),
  },
];

const Template = (props: ITabPanelProps<Test>) => (
  <div>
    <TabPanel<Test> {...props} dataSource={tabs} height={280} />
  </div>
);

const TemplateMemo = (props: ITabPanelProps<Test>) => (
  <div>
    <TabPanelMemo<Test> {...props} dataSource={tabs} height={280} />
  </div>
);

export const Basic: StoryObj<typeof TabPanel<Test>> = {
  render: Template,
  args: {}
};

export const Memo: StoryObj<typeof TabPanelMemo<Test>> = {
  render: TemplateMemo,
  args: {}
};
