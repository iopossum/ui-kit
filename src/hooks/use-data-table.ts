import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import DataSource from 'devextreme/data/data_source';
import type { IDataGridOptions, IColumnProps } from 'devextreme-react/data-grid';
import type { IFileUploaderOptions } from 'devextreme-react/file-uploader';
import { keyBy } from 'lodash-es';
import type { ParseConfig as CsvParseConfig } from 'papaparse';

import { errorHandler } from '@utils/api';
import { readCSV, readXLS } from '@utils/file';


interface IUseDataTable {
  (props: {
    editable?: boolean;
    dataGridToolbarIcons?: {
      createByLink?: boolean;
      upload?: boolean;
      refresh?: boolean;
    };
    createPath?: string;
    dataSource?: DataSource;
    uploadOptions?: IFileUploaderOptions;
    columns?: IColumnProps[];
    csvParseOptions?: CsvParseConfig;
    handleUpload?: (e: Record<string, unknown>[]) => void;
  }): {
    onToolbarPreparing: IDataGridOptions['onToolbarPreparing'];
  };
}

export const useDataTable: IUseDataTable = ({
  editable,
  dataGridToolbarIcons,
  createPath,
  dataSource,
  uploadOptions,
  columns,
  csvParseOptions,
  handleUpload,
}) => {
  const match = useRouteMatch();
  const history = useHistory();

  const onToolbarPreparing = useCallback<NonNullable<IDataGridOptions['onToolbarPreparing']>>(
    (e) => {
      if (dataGridToolbarIcons) {
        const { createByLink, refresh, upload } = dataGridToolbarIcons;
        if (createByLink && editable) {
          e.toolbarOptions.items?.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'plus',
              hint: 'Создать',
              onClick: () => history.push(createPath || `${match.url}/create`),
            },
          });
        }
        if (upload && editable) {
          e.toolbarOptions.items?.unshift({
            location: 'after',
            widget: 'dxFileUploader',
            options: {
              accept:
                '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
              allowedFileExtensions: ['.xls', '.xlsx', '.csv'],
              showFileList: false,
              hint: 'Загрузить',
              width: '36px',
              labelText: '',
              selectButtonText: '',
              uploadMode: 'useButtons',
              allowCanceling: false,
              onContentReady: (e) => {
                const node = document.createElement('I');
                node.className = 'dx-icon dx-icon-upload';
                e.element.querySelector('.dx-button-content')?.appendChild(node);
              },
              onValueChanged: async function (e) {
                if (e.value && e.value.length) {
                  const results: Record<string, unknown>[] = [];
                  try {
                    const name = e.value[0].name;
                    const exts = this.allowedFileExtensions;
                    const isValid = exts?.some((v) => new RegExp(`${v}$`).test(name));
                    if (!isValid) {
                      e.component.reset();
                      throw new Error(`Неверный формат файла. Докускаются форматы ${exts?.join(', ')}`);
                    }
                    let rows = [];
                    if (/\.csv$/.test(name)) {
                      rows = (await readCSV(e.value[0], csvParseOptions)) as unknown[];
                    } else {
                      rows = (await readXLS(e.value[0])) as unknown[];
                    }
                    if (rows.length <= 1) {
                      throw new Error('Не удалось найти записи в файле');
                    }
                    const columnsObj = keyBy(columns, 'caption');
                    const header = rows.splice(0, 1)[0];
                    if (!header) {
                      throw new Error(
                        'Неверный формат данных в файле. Первая строка должна содержать названия колонок',
                      );
                    }
                    const headers = {} as Record<string, unknown>;
                    (header as string[]).forEach((name, index) => {
                      if (name && columnsObj[name]) {
                        headers[index] = columnsObj[name].dataField;
                      }
                    });
                    if (!Object.keys(headers).length) {
                      throw new Error(
                        'Неверный формат данных в файле. Первая строка должна содержать названия колонок',
                      );
                    }
                    rows.forEach((row) => {
                      const json = {} as Record<string, unknown>;
                      (row as string[]).forEach((value, index) => {
                        if (headers[index]) {
                          json[headers[index] as string] = value;
                        }
                      });
                      if (Object.keys(json).length) {
                        results.push(json);
                      }
                    });
                    handleUpload?.(results);
                  } catch (e: unknown) {
                    errorHandler({
                      showToast: true,
                      message: e instanceof Error ? e.message : 'Ошибка загрузки файла',
                    });
                  }
                }
              },
              ...uploadOptions,
            } as IFileUploaderOptions,
          });
        }
        if (refresh) {
          e.toolbarOptions.items?.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
              icon: 'refresh',
              hint: 'Обновить',
              onClick: () => dataSource && dataSource.reload(),
            },
          });
        }
      }
    },
    [
      editable,
      dataSource,
      dataGridToolbarIcons,
      createPath,
      match,
      history,
      columns,
      csvParseOptions,
      handleUpload,
      uploadOptions,
    ],
  );

  return { onToolbarPreparing };
};