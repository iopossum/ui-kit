import React, { useMemo, memo, forwardRef, FC } from 'react';

import Form, { GroupItem, SimpleItem } from 'devextreme-react/form';
import type { IColCountByScreenProps, IFormOptions, IItemProps } from 'devextreme-react/form';
import { groupBy } from 'lodash-es';

const colCountByScreen: IColCountByScreenProps = {
  xs: 1,
  sm: 2,
  md: 3,
};

const screenByWidth = (groups: Record<string, unknown>, width: number) => {
  let result = 'md';
  if (groups && Object.keys(groups).length > 0 && Object.keys(groups).length < 3) {
    result = 'sm';
  }
  if (width < 1050) {
    result = 'sm';
  }
  if (width < 600) {
    result = 'xs';
  }
  return result;
};

const getAttrs = (v: IFormItem) => {
  const attrs = {
    dataField: v.dataField,
    label: { text: v.caption },
    validationRules: [],
    editorOptions: {},
  } as IFormItem;
  if (v.type === 'date') {
    attrs.editorType = 'dxDateBox';
    if (v.editorOptions) {
      attrs.editorOptions = v.editorOptions;
    }
  }
  if (v.textarea) {
    attrs.editorType = 'dxTextArea';
  }
  if (v.frontLookup) {
    attrs.editorType = 'dxSelectBox';
    attrs.editorOptions = v.editorOptions;
  }
  if (v.characters) {
    attrs.editorOptions.onInput = ({ event, component }: IItemProps['editorOptions']['onInput']) => {
      const { value } = event.target;
      if (!new RegExp(`^[${v.characters}]+$`, 'gi').test(value)) {
        const escaped = value.replace(new RegExp(`[^${v.characters}]`, 'gi'), '');
        component.option('text', escaped);
        component.option('value', escaped);
        component.repaint();
        component.focus();
      }
    };
  }
  if (v.mask) {
    attrs.editorOptions.mask = v.mask;
  }
  if (v.patternType) {
    switch (v.patternType) {
      case 'email':
        attrs.validationRules?.push({
          type: 'email',
          message: 'Неверный формат',
        });
        break;
    }
  }
  if (v.required) {
    attrs.validationRules?.push({
      type: 'required',
      message: 'Не заполнено поле',
    });
  }
  if (v.editable === false) {
    attrs.editorOptions.disabled = true;
  }
  return attrs;
};

export interface IFormItem extends IItemProps {
  group?: string;
  type?: string;
  textarea?: boolean;
  frontLookup?: boolean;
  characters?: string;
  mask?: string;
  patternType?: string;
  required?: boolean;
  editable?: boolean;
  invisible?: boolean;
  editInvisible?: boolean;
  tooltip?: string;
}

export interface IFormDataProps<T = object> extends IFormOptions {
  filteredColumns: IFormItem[];
  data: Partial<T>;
  grouped?: boolean;
  dataPropCanChanged?: string | string[];
  onChange?: (e: Record<keyof T, T[keyof T]>) => void;
}

export type FormDataHandle = Form;

interface IFormDataWithRef extends FC<IFormDataProps<object>> {
  <T extends object>(
    props: IFormDataProps<T> & React.RefAttributes<Form>,
  ): ReturnType<React.ForwardRefRenderFunction<Form, IFormDataProps<T>>>;
}

const FormDataWithRef: IFormDataWithRef = forwardRef(
  <T extends object>(
    { filteredColumns, data, grouped, onChange, ...rest }: IFormDataProps<T>,
    ref: React.ForwardedRef<Form>,
  ) => {
    const groups = useMemo(() => {
      return !grouped || (grouped && !filteredColumns.some((v) => v.group)) ? {} : groupBy(filteredColumns, 'group');
    }, [filteredColumns, grouped]);

    return (
      <Form
        ref={ref}
        colCountByScreen={colCountByScreen}
        screenByWidth={screenByWidth.bind(null, groups)}
        formData={{ ...data }}
        readOnly={false}
        showColonAfterLabel={true}
        showValidationSummary={false}
        onFieldDataChanged={(e) => {
          if (typeof e.value !== 'undefined') {
            const b = {} as Record<keyof T, T[keyof T]>;
            b[e.dataField as keyof T] = e.value;
            onChange?.(b);
          }
        }}
        minColWidth={233}
        {...rest}
      >
        {Object.keys(groups).length > 0
          ? Object.keys(groups).map((key) => {
              return (
                <GroupItem key={key} caption={key !== 'undefined' ? key : undefined}>
                  {groups[key].map((v) => {
                    const attrs = getAttrs(v);
                    return <SimpleItem {...attrs} key={v.dataField} />;
                  })}
                </GroupItem>
              );
            })
          : filteredColumns.map((v) => {
              const attrs = getAttrs(v);
              return <SimpleItem {...attrs} key={v.dataField} />;
            })}
      </Form>
    );
  },
);

FormDataWithRef.defaultProps = {
  filteredColumns: [],
  labelLocation: 'left',
};

export const FormData = memo(FormDataWithRef, (prev, cur) => {
  let notChanged = prev.labelLocation === cur.labelLocation;
  if (notChanged && cur.dataPropCanChanged) {
    const array: string[] =
      typeof cur.dataPropCanChanged === 'string' ? [cur.dataPropCanChanged] : cur.dataPropCanChanged;
    const prevData = prev.data as Record<string, unknown>;
    const curData = cur.data as Record<string, unknown>;
    notChanged = array.every((key) => prevData?.[key] === curData?.[key]);
  }
  return notChanged;
}) as typeof FormDataWithRef;
