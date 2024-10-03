import React, { CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { TabPanel, TabPanelMemo } from '@components/tab-panel';
import type { ITabPanelItemProps, ITabPanelProps } from '@components/tab-panel';

export default {
  title: 'TabPanel',
  component: TabPanel,
} as Meta<typeof TabPanel>;

interface ITest {
  test: string;
}

const STYLE: CSSProperties = { border: '1px solid red' };

const TabComponent: ITabPanelItemProps<ITest>['component'] = ({ padding, minHeight, maxHeight }) => {
  return (
    <div
      style={{
        ...STYLE,
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

const tabs: ITabPanelItemProps<ITest>[] = [
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

const Template = (props: ITabPanelProps<ITest>) => (
  <div>
    <TabPanel<ITest> {...props} dataSource={tabs} height={280} />
  </div>
);

const TemplateMemo = (props: ITabPanelProps<ITest>) => (
  <div>
    <TabPanelMemo<ITest> {...props} dataSource={tabs} height={280} />
  </div>
);

export const Basic: StoryObj<typeof TabPanel<ITest>> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof TabPanelMemo<ITest>> = {
  render: TemplateMemo,
  args: {},
};
