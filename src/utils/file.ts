import { Workbook } from 'exceljs';
import { parse as CSVParse } from 'papaparse';
import type { ParseConfig as CsvParseConfig } from 'papaparse';

export const readCSV = (file: File, options?: CsvParseConfig<unknown, unknown>) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(
        CSVParse<unknown>(event.target?.result as string, {
          ...options,
          complete: (results) => {
            resolve(results.data);
          },
        }),
      );
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const readXLS = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        new Workbook().xlsx
          .load(event.target.result as unknown as Buffer)
          .then(function (workbook) {
            const rows: unknown[] = [];
            workbook.worksheets[0].eachRow(function (row) {
              rows.push(row.values);
            });
            resolve(rows);
          })
          .catch(reject);
      } else {
        reject(new Error('Ошибка загрузки файла. Файл неизвестного формата'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
