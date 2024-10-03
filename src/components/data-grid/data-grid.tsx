import React, { forwardRef, useMemo, memo, useState, useCallback, FC } from 'react';

import type { Column } from 'devextreme/ui/data_grid';
import { DataGrid as DevexpressDataGrid } from 'devextreme-react/data-grid';
import type { IDataGridOptions, IColumnProps } from 'devextreme-react/data-grid';

import type { IWithStyles } from '@types';

import './data-grid.scss';

type TColumn<T extends object = {}> = IColumnProps & Column<T>;

export interface IColumn<T extends object = {}> extends TColumn<T> {}

export interface IDataGridProps<T extends object = {}>
  extends Omit<IDataGridOptions<T>, 'style' | 'columns'>,
    IWithStyles {
  columns: TColumn<T>[];
  dataSource: IDataGridOptions['dataSource'];
  stateStoringName?: string;
  loadPanelShading?: boolean;
  summaryColumn?: string;
}

export interface IDataGridHandle extends DevexpressDataGrid {}

export interface IDataGridComponent extends FC<IDataGridProps<object>> {
  <T extends object>(
    props: IDataGridProps<T> & React.RefAttributes<IDataGridHandle>,
  ): ReturnType<React.ForwardRefRenderFunction<IDataGridHandle, IDataGridProps<T>>>;
}

export const DataGrid: IDataGridComponent = forwardRef(
  <T extends object = {}>(props: IDataGridProps<T>, ref: React.ForwardedRef<IDataGridHandle>) => {
    const {
      columns = [],
      stateStoringName,
      loadPanelShading,
      children,
      summaryColumn,
      onOptionChanged,
      ...rest
    } = props;
    const { summary, loadPanel, stateStoring } = rest;

    const multipleTotalSummary = summary?.totalItems && summary.totalItems.length > 1;

    const [summaryColumnKey, setSummaryColumnKey] = useState<string | null | undefined>(() => {
      if (multipleTotalSummary || !columns?.length) {
        return null;
      }
      let filtered: Column[] = [];
      if (summaryColumn) {
        filtered = columns.filter((v) => v.dataField === summaryColumn);
        if (filtered[0]?.visible) {
          return summaryColumn;
        }
      }
      filtered = columns.filter((v) => v.visible);
      return filtered.length ? filtered[0].dataField : columns[0].dataField;
    });

    const handleOptionChanged = useCallback<NonNullable<IDataGridOptions['onOptionChanged']>>(
      (e) => {
        const { name, fullName, component, value } = e;
        if (name === 'columns') {
          const splits = fullName.split('.').filter((v) => v.indexOf('columns') > -1);
          let columnContainer!: Column;
          splits.forEach((v) => {
            const index = parseInt(v.replace(/[^0-9]/g, ''), 10);
            columnContainer = columns[index];
            if (columnContainer && columnContainer.columns && columnContainer.columns.length) {
              columnContainer = columnContainer.columns[0] as Column;
            }
          });
          if (columnContainer?.dataField) {
            component.columnOption(columnContainer.dataField, value);
            const column = component.columnOption(columnContainer.dataField);
            if (summaryColumnKey === column.dataField) {
              if (!value) {
                const visibleColumns: Column[] = component.state().columns.filter((v: Column) => v.visible);
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

    const memoProps = useMemo(() => {
      const result: Pick<IDataGridProps<T>, 'summary' | 'loadPanel' | 'stateStoring'> = {};
      if (!multipleTotalSummary && summary?.totalItems?.length) {
        if (!summary.totalItems.some((v) => v.column === summaryColumnKey)) {
          summary.totalItems[0].showInColumn = summaryColumnKey as string;
        }
        result.summary = summary;
      }
      if (loadPanelShading) {
        result.loadPanel = Object.assign(
          {
            enabled: true,
            shading: true,
            shadingColor: 'rgba(0, 0, 0, 0.1)',
          },
          loadPanel || {},
        );
      }
      if (stateStoringName) {
        result.stateStoring = Object.assign(
          {
            storageKey: stateStoringName,
            type: 'localStorage',
            enabled: true,
          },
          stateStoring || {},
        );
      }
      return result;
    }, [multipleTotalSummary, stateStoring, stateStoringName, summary, summaryColumnKey, loadPanelShading, loadPanel]);

    /**
 * 
  showBorders: true,
  repaintChangesOnly: true,
  allowColumnReordering: true,
  allowColumnResizing: true,
  columnResizingMode: 'nextColumn',
  columnMinWidth: 50,
  columns: [],
  
 * 
 */

    return (
      <DevexpressDataGrid<T>
        id="data-grid"
        showBorders
        repaintChangesOnly
        allowColumnReordering
        allowColumnResizing
        columnResizingMode="nextColumn"
        columnMinWidth={50}
        hoverStateEnabled={false}
        focusedRowEnabled={false}
        wordWrapEnabled={false}
        ref={ref}
        {...rest}
        {...memoProps}
        columns={columns}
        onOptionChanged={handleOptionChanged}
      >
        {children}
      </DevexpressDataGrid>
    );
  },
);

export const DataGridMemo = memo(DataGrid) as typeof DataGrid;
