import React, { forwardRef, useMemo, memo, useState, useCallback } from 'react';

import { DataGrid as DevexpressDataGrid } from 'devextreme-react/data-grid';
import type { IDataGridOptions, IColumnProps } from 'devextreme-react/data-grid';

import type { IWithStyles } from '@types';

import './data-grid.scss';

type OnOptionChanged = NonNullable<IDataGridOptions['onOptionChanged']>;

export interface IDataGridProps extends Omit<IDataGridOptions, 'style' | 'columns'>, IWithStyles {
  dataSource: IDataGridOptions['dataSource'];
  columns: IColumnProps[];
  stateStoringName?: string;
  loadPanelShading?: boolean;
  summaryColumn?: string;
}

export type DataGridHandle = DevexpressDataGrid;

export const DataGrid = forwardRef<DataGridHandle, IDataGridProps>((props, ref) => {
  const { columns, stateStoringName, loadPanelShading, children, summaryColumn, onOptionChanged, ...rest } = props;
  let { loadPanel, stateStoring } = rest;
  const { summary } = rest;

  const multipleTotalSummary = summary?.totalItems && summary.totalItems.length > 1;

  const [summaryColumnKey, setSummaryColumnKey] = useState<string | null>(() => {
    if (multipleTotalSummary || !columns.length) {
      return null;
    }
    let filtered: IColumnProps[] = [];
    if (summaryColumn) {
      filtered = columns.filter((v) => v.dataField === summaryColumn);
      if (filtered[0]?.visible) {
        return summaryColumn;
      }
    }
    filtered = columns.filter((v) => v.visible);
    return filtered.length ? filtered[0].dataField : columns[0].dataField;
  });

  const summaryMemo = useMemo(() => {
    if (!multipleTotalSummary && summary?.totalItems?.length) {
      if (!summary.totalItems.some((v) => v.column === summaryColumnKey)) {
        summary.totalItems[0].column = summaryColumnKey as string;
      }
    }
    return { ...summary };
  }, [summary, summaryColumnKey, multipleTotalSummary]);

  const handleOptionChanged = useCallback<OnOptionChanged>(
    (e) => {
      const { name, fullName, component, value } = e;
      if (name === 'columns') {
        const splits = fullName.split('.').filter((v) => v.indexOf('columns') > -1);
        let columnContainer!: IColumnProps;
        splits.forEach((v) => {
          const index = parseInt(v.replace(/[^0-9]/g, ''), 10);
          columnContainer = columns[index];
          if (columnContainer && columnContainer.columns && columnContainer.columns.length) {
            columnContainer = columnContainer.columns;
          }
        });
        if (columnContainer?.dataField) {
          component.columnOption(columnContainer.dataField, value);
          const column = component.columnOption(columnContainer.dataField);
          if (summaryColumnKey === column.dataField) {
            if (!value) {
              const visibleColumns: IColumnProps[] = component.state().columns.filter((v: IColumnProps) => v.visible);
              if (visibleColumns.length) {
                setSummaryColumnKey(visibleColumns[0].dataField);
              }
            }
          } else if (summaryColumn && component.columnOption(summaryColumn)?.visible) {
            setSummaryColumnKey(summaryColumn);
          }
        }
      }
      onOptionChanged?.(e);
    },
    [columns, summaryColumnKey, summaryColumn, onOptionChanged],
  );

  if (loadPanelShading) {
    loadPanel = Object.assign(
      {
        enabled: true,
        shading: true,
        shadingColor: 'rgba(0, 0, 0, 0.1)',
      },
      loadPanel || {},
    );
  }

  if (stateStoringName) {
    stateStoring = Object.assign(
      {
        storageKey: stateStoringName,
        type: 'localStorage',
        enabled: true,
      },
      stateStoring || {},
    );
  }

  return (
    <DevexpressDataGrid
      ref={ref}
      {...rest}
      loadPanel={loadPanel}
      stateStoring={stateStoring}
      columns={columns}
      summary={summaryMemo}
      onOptionChanged={handleOptionChanged}
    >
      {children}
    </DevexpressDataGrid>
  );
});

DataGrid.defaultProps = {
  id: 'data-grid',
  showBorders: true,
  repaintChangesOnly: true,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnResizingMode: 'nextColumn',
  columnMinWidth: 50,
  columns: [],
  hoverStateEnabled: false,
  focusedRowEnabled: false,
  wordWrapEnabled: false,
  loadPanelShading: false,
};

export const DataGridMemo = memo(DataGrid);
