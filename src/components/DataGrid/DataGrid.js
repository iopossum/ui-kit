import React, { useRef, forwardRef, useMemo, memo, useState, useCallback } from 'react';
import { string, number, oneOfType, oneOf, element, node, object, array, func, bool, any } from 'prop-types';
import { getLSItem, setLSItem } from '@utils';

import {
  DataGrid as DevexpressDataGrid,
  Column,
  Sorting as DevexpressSorting,
  Scrolling,
  Summary,
  TotalItem,
  HeaderFilter,
  RequiredRule,
  PatternRule,
  ColumnChooser,
  ColumnFixing,
  FilterRow,
  StateStoring,
  Selection,
  Export,
  Editing
} from 'devextreme-react/data-grid';

import { useCookiePrefix } from '@hooks';

import './DataGrid.scss';

export const MemoizedDataGrid = memo(
  forwardRef((props, ref) => <DevexpressDataGrid ref={ref} {...props}/>));

export const DataGrid = memo(forwardRef(({
  id,
  style,
  height,
  showBorders,
  dataSource,
  repaintChangesOnly,
  allowColumnReordering,
  allowColumnResizing,
  columnResizingMode,
  columnMinWidth,
  onToolbarPreparing,
  onCellClick,
  columns,
  scrollingMode,
  allowExport,
  exportFilename,
  allowExportSelectedData,
  customizeExcelCell,
  allowSelection,
  selectionMode,
  allowSorting,
  sortingMode,
  allowFilterRow,
  allowHeaderFilter,
  allowColumnChooser,
  allowColumnFixing,
  allowSummaryCount,
  allowStateStoring,
  stateStoringName,
  onRowClick,

  allowEditing,
  allowAdding,
  allowDeleting,
  allowUpdating,
  confirmDelete,
  editingMode,
  editingUseIcons,
  startEditAction,

  hoverStateEnabled,
  selectedRowKeys,
  onSelectionChanged,
  focusedRowEnabled,
  defaultFocusedRowKey,
  focusedRowKey,
  wordWrapEnabled,

  loadPanelShading,
  totalCountRef,
  remoteTotalCount,

  children,
  ...props
}, ref) => {

  const [memoColumns, setMemoColumns] = useState(columns);
  const cookieName = useCookiePrefix(stateStoringName);

  const summaryKey = useMemo(() => {
    if (!allowSummaryCount) {
      return '';
    }
    const filtered = memoColumns.filter(v => v.visible);
    return filtered.length ? filtered[0].dataField : '';
  }, [allowSummaryCount, memoColumns]);

  const onOptionChanged = useCallback(({ name, fullName, component, value }) => {
    if (name === 'columns') {
      const splits = fullName.split('.').filter(v => v.indexOf('columns') > -1);
      let columnContainer = memoColumns;
      splits.forEach(v => {
        const index = parseInt(v.replace(/[^0-9]/g, ''), 10);
        columnContainer = memoColumns[index];
        if (columnContainer && columnContainer.columns && columnContainer.columns.length) {
          columnContainer = columnContainer.columns;
        }
      });
      if (columnContainer && columnContainer.dataField) {
        const column = component.columnOption(columnContainer.dataField);
        setMemoColumns(memoColumns.map(v => {
          if (v.dataField === column.dataField) {
            v.visible = value;
          }
          return v;
        }));
      }
    }
  }, [summaryKey, memoColumns]);

  const additionalProps = {};
  if (loadPanelShading) {
    additionalProps.loadPanel = {
      enabled: true,
      shading: true,
      shadingColor: 'rgba(0, 0, 0, 0.1)',
    }
  }

  const totalCountAttrs = useMemo(() => {
    const attrs = {
      displayFormat: 'Всего: {0}',
      alignment: "left",
      column: summaryKey,
      summaryType: 'count',
    }
    if (remoteTotalCount) {
      attrs.customizeText = (e) => `${totalCountRef.current} записей`;
    }
    return attrs;
  }, [allowSummaryCount, summaryKey, remoteTotalCount]);

  return (
    <MemoizedDataGrid
      style={style}
      height={height}
      ref={ref}
      id={id}
      showBorders={showBorders}
      dataSource={dataSource}
      repaintChangesOnly={repaintChangesOnly}
      allowColumnReordering={allowColumnReordering}
      allowColumnResizing={allowColumnResizing}
      columnResizingMode={columnResizingMode}
      columnMinWidth={columnMinWidth}
      onToolbarPreparing={onToolbarPreparing}
      onCellClick={onCellClick}
      onRowClick={onRowClick}
      onOptionChanged={onOptionChanged}
      hoverStateEnabled={hoverStateEnabled}
      selectedRowKeys={selectedRowKeys}
      onSelectionChanged={onSelectionChanged}
      focusedRowEnabled={focusedRowEnabled}
      defaultFocusedRowKey={defaultFocusedRowKey}
      wordWrapEnabled={wordWrapEnabled}
      focusedRowKey={focusedRowKey}
      {...props}
      {...additionalProps}
    >
      <Scrolling
        mode={scrollingMode}
      />
      { allowExport && (
        <Export
          enabled={true}
          ignoreExcelErrors
          fileName={exportFilename}
          allowExportSelectedData={allowExportSelectedData}
          customizeExcelCell={customizeExcelCell}
        />
      )}
      { allowSelection && (
        <Selection mode={selectionMode} />
      )}
      { allowFilterRow && (
        <FilterRow visible applyFilter='auto' />
      )}
      { allowHeaderFilter && (
        <HeaderFilter visible />
      )}
      { allowColumnChooser && (
        <ColumnChooser enabled={true} mode="select" />
      )}
      { allowColumnFixing && (
        <ColumnFixing enabled={true} />
      )}

      { allowSorting && (
        <DevexpressSorting mode={sortingMode} />
      )}

      { allowSummaryCount && summaryKey ? (
        <Summary>
          <TotalItem {...totalCountAttrs} />
        </Summary>
      ) : null}

      { allowStateStoring && !!stateStoringName && (
        <StateStoring
          enabled={true}
          type={'localStorage'}
          storageKey={cookieName}
        />
      )}

      { allowEditing && (
        <Editing
          mode={editingMode}
          allowAdding={allowAdding}
          allowUpdating={allowUpdating}
          allowDeleting={allowDeleting}
          useIcons={editingUseIcons}
          confirmDelete={confirmDelete}
          startEditAction={startEditAction}
         />
      )}

      { children }

      { columns.map((v, i) => (
        <Column key={i} {...{...v, type: undefined}} >
          {v.required ? <RequiredRule /> : null}
          {v.pattern ? <PatternRule {...v.pattern} /> : null}
        </Column>
      )) }

    </MemoizedDataGrid>
  )
}));

DataGrid.propTypesConstants = {
  columnResizingMode: ['nextColumn', 'widget'],
  scrollingMode: ['virtual', 'standard', 'infinite'],
  selectionMode: ['multiple', 'none', 'single'],
  sortingMode: ['single', 'none', 'multiple'],
  editingMode: [ 'batch', 'cell', 'row', 'form', 'popup'],
  startEditAction: [ 'click', 'dblClick']
};

DataGrid.propTypes = {
  /** id  */
  id: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Height */
  height: oneOfType([string, number]),
  /** showBorders */
  showBorders: bool,
  /** dataSource */
  dataSource: oneOfType([object, array]).isRequired,
  /** repaintChangesOnly */
  repaintChangesOnly: bool,
  /** allowColumnReordering */
  allowColumnReordering: bool,
  /** allowColumnResizing */
  allowColumnResizing: bool,
  /** columnResizingMode */
  columnResizingMode: oneOf(DataGrid.propTypesConstants.columnResizingMode),
  /** columnMinWidth */
  columnMinWidth: number,
  /** columns */
  columns: array,
  /** scrollingMode */
  scrollingMode: oneOf(DataGrid.propTypesConstants.scrollingMode),
  /** onToolbarPreparing callback*/
  onToolbarPreparing: func,
  /** onCellClick callback*/
  onCellClick: func,
  /** allowExport */
  allowExport: bool,
  /** exportFilename  */
  exportFilename: string,
  /** allowExportSelectedData */
  allowExportSelectedData: bool,
  /** customizeExcelCell callback*/
  customizeExcelCell: func,
  /** allowSelection */
  allowSelection: bool,
  /** scrollingMode */
  selectionMode: oneOf(DataGrid.propTypesConstants.selectionMode),
  /** allowSorting */
  allowSorting: bool,
  /** sortingMode */
  sortingMode: oneOf(DataGrid.propTypesConstants.sortingMode),
  /** allowFilterRow */
  allowFilterRow: bool,
  /** allowHeaderFilter */
  allowHeaderFilter: bool,
  /** allowColumnChooser */
  allowColumnChooser: bool,
  /** allowColumnFixing */
  allowColumnFixing: bool,
  /** allowSummaryCount */
  allowSummaryCount: bool,
  /** allowStateStoring */
  allowStateStoring: bool,
  /** stateStoringName */
  stateStoringName: string,
  /** onRowClick callback*/
  onRowClick: func,
  /** children */
  children: node,

  /** allowEditing */
  allowEditing: bool,
  /** allowAdding */
  allowAdding: bool,
  /** allowDeleting */
  allowDeleting: bool,
  /** allowUpdating */
  allowUpdating: bool,
  /** confirmDelete */
  confirmDelete: bool,
  /** editingMode */
  editingMode: oneOf(DataGrid.propTypesConstants.editingMode),
  /** editingUseIcons */
  editingUseIcons: bool,
  /** editingUseIcons */
  startEditAction: oneOf(DataGrid.propTypesConstants.startEditAction),

  /** hoverStateEnabled */
  hoverStateEnabled: bool,
  /** selectedRowKeys */
  selectedRowKeys: array,
  /** onSelectionChanged */
  onSelectionChanged: func,
  /** focusedRowEnabled */
  focusedRowEnabled: bool,
  /** defaultFocusedRowKey */
  defaultFocusedRowKey: any,
  /** wordWrapEnabled */
  wordWrapEnabled: bool,
  /** loadPanelShading */
  loadPanelShading: bool,
  /** focusedRowKey */
  focusedRowKey: any,

  totalCountRef: object,
  remoteTotalCount: bool
};

DataGrid.defaultProps = {
  id: 'data-grid',
  showBorders: true,
  repaintChangesOnly: true,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnResizingMode: DataGrid.propTypesConstants.columnResizingMode[0],
  columnMinWidth: 50,
  onToolbarPreparing: () => {},
  onCellClick: () => {},
  columns: [],
  scrollingMode: DataGrid.propTypesConstants.scrollingMode[0],
  allowExport: false,
  exportFilename: 'Выгрузка',
  allowExportSelectedData: true,
  customizeExcelCell: () => {},
  allowSelection: false,
  selectionMode: DataGrid.propTypesConstants.selectionMode[0],
  allowSorting: true,
  sortingMode: DataGrid.propTypesConstants.sortingMode[0],
  allowFilterRow: true,
  allowHeaderFilter: true,
  allowColumnChooser: true,
  allowColumnFixing: true,
  allowSummaryCount: false,
  allowStateStoring: false,
  onRowClick: () => {},

  allowEditing: false,
  allowAdding: false,
  allowDeleting: false,
  allowUpdating: false,
  confirmDelete: true,
  editingMode: DataGrid.propTypesConstants.editingMode[0],
  editingUseIcons: true,
  startEditAction: DataGrid.propTypesConstants.startEditAction[0],

  hoverStateEnabled: false,
  focusedRowEnabled: false,
  onSelectionChanged: () => {},
  wordWrapEnabled: false,
  loadPanelShading: false,

  remoteTotalCount: false
};
