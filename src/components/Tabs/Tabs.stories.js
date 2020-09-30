import React, {useEffect} from 'react';
import { Tabs, TabsAutosize } from './index';
import { withKnobs, text, object, number, boolean, select } from "@storybook/addon-knobs";
import { withInfo, withRouter } from '../../../.storybook/decorators';

export default {
  title: 'Tabs',
  component: Tabs,
  decorators: [
    withKnobs,
    withInfo(),
    withRouter
  ]
};


const TabComponent = ({ padding, minHeight, maxHeight }) => {
  return (
    <div style={{ border: '1px solid red', padding, minHeight, maxHeight, height: maxHeight }}>{JSON.stringify({ padding, minHeight, maxHeight })}</div>
  );
};

const tabs = [
  { title: 'Tab 1', component: (props) => <div>Tab 1 <TabComponent {...props}/></div>  },
  { title: 'Tab 2', component: (props) => <div>Tab 2 <TabComponent {...props}/></div> },
];


export const Компонент = () => (
  <Tabs
    tabs={tabs}
    tabContentPadding={number('tabContentPadding', Tabs.defaultProps.tabContentPadding)}
    tabContentMinHeight={number('tabContentMinHeight', Tabs.defaultProps.tabContentMinHeight)}
    tabContentDefaultMaxHeight={number('tabContentDefaultMaxHeight', Tabs.defaultProps.tabContentDefaultMaxHeight)}
    storageName="tab"
  />
);

export const Autosize = () => (
  <TabsAutosize
    className={text("className", "")}
    style={object("style", {})}
    tabs={tabs}
    tabContentPadding={number('tabContentPadding', Tabs.defaultProps.tabContentPadding)}
    tabContentMinHeight={number('tabContentMinHeight', Tabs.defaultProps.tabContentMinHeight)}
    tabContentDefaultMaxHeight={number('tabContentDefaultMaxHeight', Tabs.defaultProps.tabContentDefaultMaxHeight)}
    storageName="tab"
  />
);
