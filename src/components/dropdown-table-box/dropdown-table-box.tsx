import React, { useCallback, useEffect, useRef, memo, forwardRef, useImperativeHandle, FC } from 'react';

import DataSource from 'devextreme/data/data_source';
import DxDropDownBox from 'devextreme-react/drop-down-box';
import type { IDropDownBoxOptions } from 'devextreme-react/drop-down-box';

import type { IDataGridProps } from '@components/data-grid';
import { useTimeoutWithRef } from '@hooks/use-timeout';

type TOnOpened = NonNullable<IDropDownBoxOptions['onOpened']>;
type TOnFocusOut = NonNullable<IDropDownBoxOptions['onFocusOut']>;
type TOnInput = NonNullable<IDropDownBoxOptions['onInput']>;
type TOnSelectionChanged = NonNullable<IDataGridProps['onSelectionChanged']>;

export interface IDropDownBoxHandle {
  refetch: () => void;
}

export interface IDropDownBoxContentHandle {
  search: (e: string) => void;
}

export interface IDropDownBoxContentProps extends Pick<IDataGridProps, 'selectedRowKeys' | 'onSelectionChanged'> {
  searchExpr?: string;
  searchValue?: string;
}

export interface IDropDownBoxProps<T = object> extends Omit<IDropDownBoxOptions, 'onChange'> {
  dropDownContent: ReturnType<typeof forwardRef<IDropDownBoxContentHandle, IDropDownBoxContentProps>>;
  searchExpr?: string;
  fetchByValue: (e: string | number) => Promise<T>;
  onChange: (e: T) => void;
  convertValueOnInput?: (e: Parameters<TOnInput>[0]) => string | null;
  onSearch?: (e: { value: IDropDownBoxOptions['value']; label: string }) => void;
}

export interface IDropDownTableBoxComponent extends FC<IDropDownBoxProps<object>> {
  <T extends object>(
    props: IDropDownBoxProps<T> & React.RefAttributes<IDropDownBoxHandle>,
  ): ReturnType<React.ForwardRefRenderFunction<IDropDownBoxHandle, IDropDownBoxProps<T>>>;
}

export const DropDownTableBox: IDropDownTableBoxComponent = forwardRef(
  <T extends object>(
    {
      value,
      displayExpr,
      valueExpr,
      searchExpr,
      onSearch,
      onChange,
      fetchByValue: outerFetchByValue,
      convertValueOnInput,
      dropDownContent: DropDownContent,
      ...props
    }: IDropDownBoxProps<T>,
    ref: React.Ref<IDropDownBoxHandle>,
  ) => {
    const boxRef = useRef<DxDropDownBox>(null);
    const boxContentRef = useRef<IDropDownBoxContentHandle>(null);
    const valueRef = useRef<unknown>(null);
    const labelRef = useRef<string>();
    const labelSelectedRef = useRef<string>();

    const setTimeoutWithRef = useTimeoutWithRef<string>();

    const handleChange = useCallback<TOnSelectionChanged>(
      (e) => {
        if (e.currentSelectedRowKeys.length) {
          boxRef.current?.instance.close();
          const data = e.selectedRowsData[0];
          if (data && data instanceof Object && valueExpr) {
            const v = typeof valueExpr === 'function' ? valueExpr(data) : data[valueExpr as keyof typeof data];
            const t = (
              typeof displayExpr === 'function' ? displayExpr(data) : data[displayExpr as keyof typeof data]
            ) as string;
            if (v && t) {
              labelRef.current = t;
              labelSelectedRef.current = labelRef.current;
              valueRef.current = v;
            }
          }
          onChange(e.selectedRowsData[0] as T);
        }
      },
      [onChange, displayExpr, valueExpr],
    );

    const handleInput = useCallback<TOnInput>(
      (e) => {
        const { text, opened } = e.component.option();
        if (convertValueOnInput) {
          const newText = convertValueOnInput(e);
          if (newText !== null) {
            const input = boxRef.current?.instance?.field() as HTMLInputElement;
            if (input) {
              input.value = newText;
            }
          }
        }
        labelRef.current = text;
        setTimeoutWithRef(() => {
          boxContentRef.current?.search(text as string);
        }, 400);
        if (!opened) {
          e.component.open();
        }
      },
      [convertValueOnInput, setTimeoutWithRef],
    );

    const handleFocusOut = useCallback<TOnFocusOut>(() => {
      if (value && labelSelectedRef.current !== labelRef.current) {
        onSearch?.({ value, label: labelRef.current as string });
      }
    }, [value, onSearch]);

    const handleOpened = useCallback<TOnOpened>(() => {
      setTimeout(() => {
        boxRef.current?.instance.focus();
      }, 100);
    }, []);

    const fetchByValue = useCallback(async () => {
      const data = await outerFetchByValue(value);
      if (data && displayExpr) {
        labelRef.current = (
          typeof displayExpr === 'function' ? displayExpr(data) : data[displayExpr as keyof T]
        ) as string;
        labelSelectedRef.current = labelRef.current;
        const input = boxRef.current?.instance?.field() as HTMLInputElement;
        if (input) {
          input.value = labelRef.current;
        }
        boxRef.current?.instance?.option('text', labelRef.current);
        boxRef.current?.instance?.repaint();
      }
    }, [value, outerFetchByValue, displayExpr]);

    useImperativeHandle(
      ref,
      () => ({
        refetch: fetchByValue,
      }),
      [fetchByValue],
    );

    useEffect(() => {
      if (value !== valueRef.current) {
        fetchByValue();
      }
    }, [value, fetchByValue]);

    return (
      <DxDropDownBox
        acceptCustomValue
        value={value || ''}
        ref={boxRef}
        deferRendering={true}
        dropDownOptions={{
          resizeEnabled: true,
        }}
        onOpened={handleOpened}
        onInput={handleInput}
        onFocusOut={handleFocusOut}
        openOnFieldClick={true}
        displayExpr={() => {
          return labelRef.current || '';
        }}
        contentRender={() => (
          <DropDownContent
            ref={boxContentRef}
            searchValue={labelRef.current}
            searchExpr={searchExpr}
            selectedRowKeys={value ? [value] : []}
            onSelectionChanged={handleChange}
          />
        )}
        dataSource={undefined}
        {...props}
      />
    );
  },
);

export const DropDownTableBoxMemo = memo(DropDownTableBox) as typeof DropDownTableBox;

type TuseDropDownTableBoxContent = {
  dataSource: DataSource;
  searchValue: string;
  searchExpr: string;
};

export const useDropDownTableBoxContent = (
  ref: React.Ref<IDropDownBoxContentHandle>,
  { dataSource, searchValue, searchExpr }: TuseDropDownTableBoxContent,
) => {
  useEffect(() => {
    dataSource?.searchExpr(searchExpr);
    if (searchValue) {
      dataSource.searchValue(searchValue);
      dataSource.reload();
    }
  }, [dataSource, searchValue, searchExpr]);

  useImperativeHandle(ref, () => ({
    search: (value) => {
      dataSource.searchValue(value);
      dataSource.reload();
    },
  }));
};
