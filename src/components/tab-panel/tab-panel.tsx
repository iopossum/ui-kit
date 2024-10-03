import React, { useCallback, memo, forwardRef } from 'react';

import DxTabPanel, { ITabPanelOptions } from 'devextreme-react/tab-panel';

import { useMergedState } from '@hooks/use-merged-state';
import { getLSItem, setLSItem } from '@utils/local-storage';

import './tab-panel.scss';

export const TabPanelCoreWithRef = forwardRef<DxTabPanel, ITabPanelOptions>((props, ref) => {
  return <DxTabPanel ref={ref} animationEnabled={false} swipeEnabled={false} {...props} />;
});

export const MemoizedTabPanelCoreWithRef = memo(TabPanelCoreWithRef);

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
  tabContentPadding = 10,
  tabContentMinHeight = 100,
  tabContentDefaultMaxHeight = 200,
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

  const handleContentReady = useCallback<NonNullable<ITabPanelOptions['onContentReady']>>(
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

  const handleChangeTab = useCallback<NonNullable<ITabPanelOptions['onOptionChanged']>>(
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

  const ItemComponent = useCallback<NonNullable<ITabPanelOptions['itemComponent']>>(
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
      onOptionChanged={handleChangeTab}
      itemComponent={ItemComponent}
      onContentReady={handleContentReady}
      {...rest}
    />
  );
};

export const TabPanelMemo = memo(TabPanel) as unknown as typeof TabPanel;
