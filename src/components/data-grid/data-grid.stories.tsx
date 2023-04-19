import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { data, columns } from '@.storybook/decorators';
import { AutoSize } from '@components/auto-size';
import { DataGrid, DataGridMemo, IDataGridProps } from '@components/data-grid';
import { useDataSource } from '@hooks/use-data-source';

export default {
  title: 'DataGrid',
  component: DataGrid,
} as ComponentMeta<typeof DataGrid>;

const Template: ComponentStory<typeof DataGrid> = (args) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  return (
    <DataGrid
      {...args}
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

const TemplateMemo: ComponentStory<typeof DataGridMemo> = (args) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  return (
    <DataGridMemo
      {...args}
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

const TemplateAutoSize: ComponentStory<typeof DataGrid> = (args: IDataGridProps) => {
  const dataSource = useDataSource({
    load: () => data,
  });
  return (
    <AutoSize<IDataGridProps>
      component={DataGrid}
      {...args}
      onKeyDown={() => ''}
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};

export const AutoSizeGrid = TemplateAutoSize.bind({});
AutoSizeGrid.args = {};
