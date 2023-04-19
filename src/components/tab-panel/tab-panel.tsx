import React, { useCallback, memo, forwardRef } from 'react';

import DxTabPanel, { ITabPanelOptions } from 'devextreme-react/tab-panel';

import { useMergedState } from '@hooks/use-merged-state';
import { getLSItem, setLSItem } from '@utils/local-storage';

import './tab-panel.scss';

export const TabPanelCoreWithRef = forwardRef<DxTabPanel, ITabPanelOptions>((props, ref) => {
  return <DxTabPanel ref={ref} animationEnabled={false} swipeEnabled={false} {...props} />;
});

export const MemoizedTabPanelCoreWithRef = memo(TabPanelCoreWithRef);

type TOnContentReady = NonNullable<ITabPanelOptions['onContentReady']>;
type TOnOptionChanged = NonNullable<ITabPanelOptions['onOptionChanged']>;
type TItemComponent = NonNullable<ITabPanelOptions['itemComponent']>;

export interface ITabPanelItemExtendedProps {
  padding: number;
  minHeight: number;
  maxHeight?: number;
}

export interface ITabPanelItemProps<T = object> {
  component: React.FC<T & ITabPanelItemExtendedProps>;
  id?: string | number;
  title?: string;
  props?: T;
}

export interface ITabPanelProps<T> extends Omit<ITabPanelOptions, 'dataSource'> {
  dataSource: Array<ITabPanelItemProps<T>>;
  height?: number;
  tabContentPadding?: number;
  tabContentMinHeight?: number;
  tabContentDefaultMaxHeight?: number;
  storageName?: string;
}

export const TabPanel = <T extends object>({
  height,
  tabContentPadding,
  tabContentMinHeight,
  tabContentDefaultMaxHeight,
  storageName,
  ...rest
}: ITabPanelProps<T>) => {
  const {
    state: { currentTab, tabHeaderHeight },
    setMergedState,
  } = useMergedState(() => ({
    currentTab: (storageName && getLSItem<number>(storageName)) || 0,
    tabHeaderHeight: 0,
  }));

  const onContentReady = useCallback<TOnContentReady>(
    ({ element }) => {
      if (!tabHeaderHeight) {
        const h = element.querySelector<HTMLElement>('.dx-tabpanel-tabs');
        if (h) {
          setMergedState({ tabHeaderHeight: h.offsetHeight });
        }
      }
    },
    [tabHeaderHeight, setMergedState],
  );

  const onChangeTab = useCallback<TOnOptionChanged>(
    (args) => {
      if (args.name === 'selectedIndex') {
        setMergedState({ currentTab: args.value });
        if (storageName) {
          setLSItem(storageName, args.value);
        }
      }
    },
    [setMergedState, storageName],
  );

  const ItemComponent = useCallback<TItemComponent>(
    ({ data }) => {
      const attrs: ITabPanelItemExtendedProps = {
        padding: tabContentPadding as number,
        minHeight: tabContentMinHeight as number,
      };
      if (height) {
        attrs.maxHeight = Math.max(
          height - tabHeaderHeight - (tabContentPadding || 0) * 2 - 2,
          tabContentDefaultMaxHeight || 0,
        );
      }
      return <data.component {...data.props} {...attrs} />;
    },
    [tabContentPadding, tabContentMinHeight, tabHeaderHeight, height, tabContentDefaultMaxHeight],
  );

  return (
    <MemoizedTabPanelCoreWithRef
      selectedIndex={currentTab}
      onOptionChanged={onChangeTab}
      itemComponent={ItemComponent}
      onContentReady={onContentReady}
      {...rest}
    />
  );
};

TabPanel.defaultProps = {
  tabs: [],
  tabContentPadding: 10,
  tabContentMinHeight: 100,
  tabContentDefaultMaxHeight: 200,
};

export const TabPanelMemo = memo(TabPanel) as unknown as typeof TabPanel;
