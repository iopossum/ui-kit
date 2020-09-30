import React, { useState } from 'react';
import { DataGrid, DataGridAutosize } from './index';
import { withKnobs, text, object, number, boolean, select } from "@storybook/addon-knobs";
import { withInfo, withStores } from '../../../.storybook/decorators';
import { useDataSource } from '../../utils/Hooks';

export default {
  title: 'DataGrid',
  component: DataGrid,
  decorators: [
    withKnobs,
    withInfo(),
    withStores
  ]
};

const data = [{
  "ID": 1,
  "CompanyName": "Super Mart of the West",
  "City": "Bentonville",
  "State": "Arkansas"
},
{
  "ID": 2,
  "CompanyName": "Electronics Depot",
  "City": "Atlanta",
  "State": "Georgia"
},
{
  "ID": 3,
  "CompanyName": "K&S Music",
  "City": "Minneapolis",
  "State": "Minnesota"
}];

const columns = [{
  dataField: 'ID',
  visible: true,
  caption: 'ID'
}, {
  dataField: 'CompanyName',
  visible: true,
  caption: 'CompanyName'
}, {
  dataField: 'City',
  visible: true,
  caption: 'City'
}, {
  dataField: 'State',
  visible: false,
  caption: 'State'
}];

export const Компонент = () => {
  const dataSource = useDataSource({
    load: () => data
  });
  const attrs = {
    id: 'data-grid',
    showBorders: boolean("showBorders", true),
    repaintChangesOnly: boolean("repaintChangesOnly", true),
    allowColumnReordering: boolean("allowColumnReordering", true),
    allowColumnResizing: boolean("allowColumnResizing", true),
    columnResizingMode: select('columnResizingMode', DataGrid.propTypesConstants.columnResizingMode, DataGrid.defaultProps.columnResizingMode),
    columnMinWidth: number('columnMinWidth', 50),
    onRowClick: () => alert('cell clicked'),
    columns,
    scrollingMode: select('scrollingMode', DataGrid.propTypesConstants.scrollingMode, DataGrid.defaultProps.scrollingMode),
    allowExport: boolean("allowExport", true),
    exportFilename: text("exportFilename", 'Выгрузка'),
    allowExportSelectedData: boolean("allowExportSelectedData", true),
    customizeExcelCell: () => {},
    allowSelection: boolean("allowSelection", false),
    selectionMode: select('selectionMode', DataGrid.propTypesConstants.selectionMode, DataGrid.defaultProps.selectionMode),
    allowSorting: boolean("allowSorting", true),
    sortingMode: select('sortingMode', DataGrid.propTypesConstants.sortingMode, DataGrid.defaultProps.sortingMode),
    allowFilterRow: boolean("allowFilterRow", true),
    allowHeaderFilter: boolean("allowHeaderFilter", true),
    allowColumnChooser: boolean("allowColumnChooser", true),
    allowColumnFixing: boolean("allowColumnFixing", true),
    allowSummaryCount: boolean("allowSummaryCount", true),
    allowStateStoring: boolean("allowStateStoring", false),
    showColumnLines: boolean("showColumnLines", false),
    showRowLines: boolean("showRowLines", false),
    rowAlternationEnabled: boolean("rowAlternationEnabled", false),
    height: number("height", undefined),
    dataSource,
    stateStoringName: 'test'
  };
  return (
    <DataGrid {...attrs} />
  );
};

export const Autosize = () => {
  const dataSource = useDataSource({
    load: () => data
  });
  const attrs = {
    id: 'data-grid',
    showBorders: boolean("showBorders", true),
    repaintChangesOnly: boolean("repaintChangesOnly", true),
    allowColumnReordering: boolean("allowColumnReordering", true),
    allowColumnResizing: boolean("allowColumnResizing", true),
    columnResizingMode: select('columnResizingMode', DataGrid.propTypesConstants.columnResizingMode, DataGrid.defaultProps.columnResizingMode),
    columnMinWidth: number('columnMinWidth', 50),
    onRowClick: () => alert('cell clicked'),
    columns,
    scrollingMode: select('scrollingMode', DataGrid.propTypesConstants.scrollingMode, DataGrid.defaultProps.scrollingMode),
    allowExport: boolean("allowExport", true),
    exportFilename: text("exportFilename", 'Выгрузка'),
    allowExportSelectedData: boolean("allowExportSelectedData", true),
    customizeExcelCell: () => {},
    allowSelection: boolean("allowSelection", false),
    selectionMode: select('selectionMode', DataGrid.propTypesConstants.selectionMode, DataGrid.defaultProps.selectionMode),
    allowSorting: boolean("allowSorting", true),
    sortingMode: select('sortingMode', DataGrid.propTypesConstants.sortingMode, DataGrid.defaultProps.sortingMode),
    allowFilterRow: boolean("allowFilterRow", true),
    allowHeaderFilter: boolean("allowHeaderFilter", true),
    allowColumnChooser: boolean("allowColumnChooser", true),
    allowColumnFixing: boolean("allowColumnFixing", true),
    allowSummaryCount: boolean("allowSummaryCount", true),
    allowStateStoring: boolean("allowStateStoring", false),
    dataSource,
    stateStoringName: 'test'
  };
  return (
    <DataGridAutosize {...attrs} />
  );
};

