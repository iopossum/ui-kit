import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TabPanel, TabPanelMemo } from '@components/tab-panel';
import type { ITabPanelItemProps } from '@components/tab-panel';

export default {
  title: 'TabPanel',
  component: TabPanel,
} as ComponentMeta<typeof TabPanel>;

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

const Template: ComponentStory<typeof TabPanel> = (args) => (
  <div>
    <TabPanel<Test> {...args} dataSource={tabs} height={280} />
  </div>
);

const TemplateMemo: ComponentStory<typeof TabPanelMemo> = (args) => (
  <div>
    <TabPanelMemo<Test> {...args} dataSource={tabs} height={280} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};
