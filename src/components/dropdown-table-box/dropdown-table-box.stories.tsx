import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { data, columns } from '@.storybook/decorators';
import { DataGrid } from '@components/data-grid';
import {
  DropDownTableBox,
  DropDownTableBoxMemo,
  IDropDownBoxProps,
  IDropDownBoxContentHandle,
  IDropDownBoxContentProps
} from '@components/dropdown-table-box';
import { useDataSource } from '@hooks/use-data-source';

export default {
  title: 'DropDownTableBox',
  component: DropDownTableBox,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DropDownTableBox>;

const DropDownTableBoxContent = forwardRef<IDropDownBoxContentHandle, IDropDownBoxContentProps>(
  ({ searchExpr, searchValue, ...rest }, ref) => {
    const dataSource = useDataSource({
      tableKey: 'ID',
      load: () => data,
    });
    useImperativeHandle(
      ref,
      () => ({
        search: (e: string) => alert(e),
      }),
      [],
    );
    return (
      <DataGrid
        selection={{
          mode: 'single',
        }}
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
        {...rest}
      />
    );
  },
);

type Test = Partial<(typeof data)[0]>;

const DropDownTableBoxWrapper = (props: IDropDownBoxProps) => {
  const [value, setValue] = useState<number | undefined>(1);
  return (
    <DropDownTableBox<Test>
      {...props}
      value={value}
      dropDownContent={DropDownTableBoxContent}
      displayExpr={'CompanyName'}
      valueExpr={'ID'}
      fetchByValue={async (e) => Promise.resolve(data[0])}
      onChange={(e) => setValue(e.ID)}
    />
  );
};

const DropDownTableBoxMemoWrapper = (props: IDropDownBoxProps) => {
  const [value, setValue] = useState<number | undefined>(1);
  return (
    <DropDownTableBoxMemo<Test>
      {...props}
      value={value}
      dropDownContent={DropDownTableBoxContent}
      displayExpr={'CompanyName'}
      valueExpr={'ID'}
      fetchByValue={async (e) => Promise.resolve(data[0])}
      onChange={(e) => setValue(e.ID)}
    />
  );
};

const Template: ComponentStory<typeof DropDownTableBox> = (args) => <DropDownTableBoxWrapper {...args} />;
const TemplateMemo: ComponentStory<typeof DropDownTableBoxMemo> = (args) => <DropDownTableBoxMemoWrapper {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};