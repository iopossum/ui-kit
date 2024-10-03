import React, { forwardRef, useImperativeHandle, useState, CSSProperties } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { data, columns } from '@.storybook/decorators';
import { DataGrid } from '@components/data-grid';
import {
  DropDownTableBox,
  DropDownTableBoxMemo,
  IDropDownBoxProps,
  IDropDownBoxContentHandle,
  IDropDownBoxContentProps,
} from '@components/dropdown-table-box';
import { useDataSource } from '@hooks/use-data-source';

const CONTAINER_STYLE: CSSProperties = { display: 'flex', alignItems: 'flex-start' };

export default {
  title: 'DropDownTableBox',
  component: DropDownTableBox,
  decorators: [
    (Story) => (
      <div style={CONTAINER_STYLE}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof DropDownTableBox>;

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
  const handleChange: IDropDownBoxProps<Test>['onChange'] = (e) => setValue(e?.ID);
  return (
    <DropDownTableBox<Test>
      {...props}
      value={value}
      dropDownContent={DropDownTableBoxContent}
      displayExpr={'CompanyName'}
      valueExpr={'ID'}
      fetchByValue={async () => Promise.resolve(data[0])}
      onChange={handleChange}
    />
  );
};

const DropDownTableBoxMemoWrapper = (props: IDropDownBoxProps) => {
  const [value, setValue] = useState<number | undefined>(1);
  const handleChange: IDropDownBoxProps<Test>['onChange'] = (e) => setValue(e?.ID);
  return (
    <DropDownTableBoxMemo<Test>
      {...props}
      value={value}
      dropDownContent={DropDownTableBoxContent}
      displayExpr={'CompanyName'}
      valueExpr={'ID'}
      fetchByValue={async () => Promise.resolve(data[0])}
      onChange={handleChange}
    />
  );
};

const Template = (props: IDropDownBoxProps) => <DropDownTableBoxWrapper {...props} />;
const TemplateMemo = (props: IDropDownBoxProps) => <DropDownTableBoxMemoWrapper {...props} />;

export const Basic: StoryObj<typeof DropDownTableBox> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof DropDownTableBoxMemo> = {
  render: TemplateMemo,
  args: {},
};
