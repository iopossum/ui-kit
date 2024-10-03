import React, { CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { data, columns } from '@.storybook/decorators';
import { AutoSize } from '@components/auto-size';
import { DataGrid, DataGridMemo, IDataGridProps } from '@components/data-grid';
import { useDataSource } from '@hooks/use-data-source';

const CONTAINER_STYLE: CSSProperties = { display: 'flex', flex: 1 };

export default {
  title: 'DataGrid',
  component: DataGrid,
  decorators: [
    (Story) => (
      <div style={CONTAINER_STYLE}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof DataGrid>;

const Template = (props: IDataGridProps) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  return (
    <DataGrid
      {...props}
      dataSource={dataSource}
      columns={columns}
      columnChooser={{
        enabled: true,
        mode: 'select',
      }}
      summary={{
        totalItems: [{ column: 'ID', displayFormat: 'Всего: {0}', alignment: 'left' }],
      }}
      summaryColumn="ID"
    />
  );
};

const TemplateMemo = (props: IDataGridProps) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  return (
    <DataGridMemo
      {...props}
      dataSource={dataSource}
      columns={columns}
      columnChooser={{
        enabled: true,
        mode: 'select',
      }}
      summary={{
        totalItems: [{ column: 'ID', displayFormat: 'Всего: {0}', alignment: 'left' }],
      }}
      summaryColumn="ID"
    />
  );
};

const TemplateAutoSize = (props: IDataGridProps) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  const handleKeyDown = () => '';
  return (
    <AutoSize<IDataGridProps>
      component={DataGrid}
      {...props}
      onKeyDown={handleKeyDown}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export const Basic: StoryObj<typeof DataGrid> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof DataGridMemo> = {
  render: TemplateMemo,
  args: {},
};

export const AutoSizeGrid: StoryObj<typeof DataGrid> = {
  render: TemplateAutoSize,
  args: {},
};
