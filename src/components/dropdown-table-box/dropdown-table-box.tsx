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
  fetchByValue: (e: T[keyof T]) => Promise<T>;
  onChange: (e: T | null) => void;
  convertValueOnInput?: (e: Parameters<TOnInput>[0]) => string | null;
  onSearch?: (e: { value: IDropDownBoxOptions['value']; label: string }) => void;
}

export interface IDropDownTableBoxComponent extends FC<IDropDownBoxProps<object>> {
  <T extends object>(
    props: IDropDownBoxProps<T> & React.RefAttributes<IDropDownBoxHandle>,
  ): ReturnType<React.ForwardRefRenderFunction<IDropDownBoxHandle, IDropDownBoxProps<T>>>;
}

const DxDropDownBoxMemo = memo(DxDropDownBox);

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
          boxRef.current?.instance?.close();
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
              setTimeout(() => {
                const input = boxRef.current?.instance?.field() as HTMLInputElement;
                if (input) {
                  input.value = labelRef.current!;
                }
                boxRef.current?.instance?.option('text', labelRef.current);
              }, 0);
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
        boxRef.current?.instance?.focus();
      }, 100);
    }, []);

    const handleDisplayExpr = useCallback(() => {
      return labelRef.current || '';
    }, []);

    const handleContentRender = useCallback(() => {
      return (
        <DropDownContent
          ref={boxContentRef}
          searchValue={labelRef.current}
          searchExpr={searchExpr}
          selectedRowKeys={value ? [value] : []}
          onSelectionChanged={handleChange}
        />
      );
    }, [handleChange, value, searchExpr, DropDownContent]);

    const handleValueChanged = useCallback<NonNullable<IDropDownBoxOptions['onValueChanged']>>(
      (e) => {
        if (e.value === null && value) {
          valueRef.current = null;
          labelRef.current = '';
          boxRef.current?.instance?.option('text', labelRef.current);
          onChange(null);
        }
      },
      [onChange, value],
    );

    const fetchByValue = useCallback(async () => {
      if (value) {
        try {
          const data = await outerFetchByValue(value);
          if (data && displayExpr) {
            labelRef.current = (
              typeof displayExpr === 'function' ? displayExpr(data) : data[displayExpr as keyof T]
            ) as string;
            labelSelectedRef.current = labelRef.current;
            setTimeout(() => {
              const input = boxRef.current?.instance?.field() as HTMLInputElement;
              if (input) {
                input.value = labelRef.current!;
              }
              boxRef.current?.instance?.option('text', labelRef.current);
            }, 0);
          }
        } catch (error) {}
      } else if (valueRef.current) {
        valueRef.current = null;
        labelRef.current = '';
        boxRef.current?.instance?.option('text', labelRef.current);
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
      <DxDropDownBoxMemo
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
        onValueChanged={handleValueChanged}
        displayExpr={handleDisplayExpr}
        contentRender={handleContentRender}
        dataSource={undefined}
        {...props}
      />
    );
  },
);

export const DropDownTableBoxMemo = memo(DropDownTableBox) as typeof DropDownTableBox;

interface IUseDropDownTableBoxContent {
  dataSource: DataSource;
  searchExpr: string;
  searchValue?: string;
}

export const useDropDownTableBoxContent = (
  ref: React.Ref<IDropDownBoxContentHandle>,
  { dataSource, searchValue, searchExpr }: IUseDropDownTableBoxContent,
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
