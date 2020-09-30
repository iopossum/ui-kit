import React, { useCallback, useState, useRef, memo, forwardRef } from 'react';
import { string, number, oneOfType, oneOf, arrayOf, node, object, array, bool, element, func } from 'prop-types';
import TabPanel from 'devextreme-react/tab-panel';

export const MemoizedTabs = memo(
  forwardRef(({
    tabs,
    currentTab,
    onChangeTab,
    tabContent,
    onContentReady
  }, ref) => {
    return (
      <TabPanel
        ref={ref}
        dataSource={tabs}
        selectedIndex={currentTab}
        onOptionChanged={onChangeTab}
        itemComponent={tabContent}
        animationEnabled={false}
        height="100%"
        swipeEnabled={true}
        onContentReady={onContentReady}
      />
    );
}));

MemoizedTabs.propTypes = {
  /** currentTab */
  currentTab: number,
  /** onChangeTab callback */
  onChangeTab: func,
  /** onContentReady callback */
  onContentReady: func,
  /** tabContent */
  tabContent: func,
  /** tabs */
  tabs: array,
};

MemoizedTabs.defaultProps = {
  tabs: [],
  onContentReady: () => {}
};
