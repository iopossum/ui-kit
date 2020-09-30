import React, { useCallback, useEffect, useMemo, useState, useRef, memo } from 'react';
import { string, number, oneOfType, oneOf, arrayOf, node, object, array, bool, element } from 'prop-types';
import cn from 'classnames';
import { useMergedState } from '@hooks';
import { getLSItem, setLSItem } from '@utils/LocalStorage';
import { useRouteMatch } from 'react-router-dom';
import { MemoizedTabs } from '@components/Tabs';
import { Observer, useLocalStore } from 'mobx-react-lite';

import './Tabs.scss';

const TabComponent = memo(({
    data,
    match,
    tabContentPadding,
    tabContentMinHeight,
    tabHeaderHeight,
    height,
    tabContentDefaultMaxHeight
}) => {
  const attrs = {
    match,
    padding: tabContentPadding,
    minHeight: tabContentMinHeight
  };
  if (height) {
    attrs.maxHeight = Math.max(height - tabHeaderHeight - (tabContentPadding || 0) * 2 - 2, tabContentDefaultMaxHeight || 0);
  }
  return <data.component {...attrs} />;
});

export const Tabs = ({
  height,
  tabs,
  tabContentPadding,
  tabContentMinHeight,
  tabContentDefaultMaxHeight,
  storageName,
}) => {

  const {
    state: {
      currentTab,
      tabHeaderHeight
    },
    setMergedState
  } = useMergedState({
    tabHeaderHeight: 0,
    currentTab: getLSItem(storageName) || 0,
  });
  const match = useRouteMatch();

  const tabContent = useCallback(p => {
    if (currentTab !== p.index) {
      return null;
    }
    if (!tabs[p.index]) {
      return null;
    }
    const TabComponent = tabs[p.index].component;
    const attrs = {
      match,
      padding: tabContentPadding,
      minHeight: tabContentMinHeight
    };
    if (height) {
      attrs.maxHeight = Math.max(height - tabHeaderHeight - (tabContentPadding || 0) * 2 - 2, tabContentDefaultMaxHeight || 0);
    }
    return <TabComponent {...attrs} />;
  }, [currentTab, tabHeaderHeight, tabs]);

  const onContentReady = useCallback(({ element }) => {
    if (!tabHeaderHeight) {
      const h = element.querySelector('.dx-tabpanel-tabs');
      if (h) {
        // setMergedState({tabHeaderHeight: h.offsetHeight});
        attrsStore.tabHeaderHeight = h.offsetHeight;
      }
    }
  }, [tabHeaderHeight]);

  const onChangeTab = useCallback(args => {
    if (args.name === 'selectedIndex') {
      setMergedState({currentTab: args.value});
      setLSItem(storageName, args.value);
    }
  }, [currentTab]);

  useEffect(() => {
    attrsStore.height = height;
  }, [height]);

  const attrsStore = useLocalStore(() => ({
    tabHeaderHeight: 0,
    match,
    tabContentPadding,
    tabContentMinHeight,
    height,
    tabContentDefaultMaxHeight,
  }));

  const tabRef = useRef((props) => (
    <Observer>
      {() => <TabComponent {...props} {...attrsStore} />}
    </Observer>
  ));

  return (
    <MemoizedTabs
      tabs={tabs}
      currentTab={currentTab}
      onChangeTab={onChangeTab}
      tabContent={tabRef.current}
      onContentReady={onContentReady}
    />
  );
};

Tabs.propTypes = {
  /** height */
  height: number,
  /** tabContentPadding */
  tabContentPadding: number,
  /** tabContentMinHeight */
  tabContentMinHeight: number,
  /** tabContentDefaultMaxHeight */
  tabContentDefaultMaxHeight: number,
  /** storageName */
  storageName: string,
  /** tabs */
  tabs: array,
};

Tabs.defaultProps = {
  tabs: [],
  storageName: 'tab',
  tabContentPadding: 10,
  tabContentMinHeight: 200,
  tabContentDefaultMaxHeight: 300
};
