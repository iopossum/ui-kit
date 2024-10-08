import React, { useCallback, useMemo, useRef, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Button, Tooltip } from 'antd';
import cn from 'classnames';
import Form from 'devextreme-react/form';
import type { IFormOptions } from 'devextreme-react/form';
import { Tooltip as DxTooltip } from 'devextreme-react/tooltip';
import type { ITooltipOptions } from 'devextreme-react/tooltip';
import { isEqual, keyBy } from 'lodash-es';

import { Prompt } from '@components/prompt';
import { useMergedState } from '@hooks/use-merged-state';
import type { IWithStyles } from '@types';
import { success, warning } from '@utils/api';

import type { IFormDataProps, IFormItem } from './form-data';
import { FormData } from './form-data';

import './auto-form.scss';

export interface IAutoFormProps<T = object>
  extends Omit<IFormDataProps<T>, 'style' | 'filteredColumns' | 'onChange'>,
    IWithStyles {
  idKey: keyof T;
  data: T;
  columns: IFormItem[];
  children?: React.ReactNode;
  autoRedirect?: boolean;
  showSuccess?: boolean;
  showSubmitButton?: boolean;
  redirectUrl?: string;
  onChange?: (e: Record<keyof T, T[keyof T]>) => void;
  onUpdate?: (key: string, e: Record<keyof T, T[keyof T]>) => Promise<T>;
  onInsert?: (e: Record<keyof T, T[keyof T]>) => Promise<T>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement | HTMLDivElement>, data: T) => void;
}

interface IState<T> {
  wasItem: T;
  tooltips: Array<ITooltipOptions & { key: string; text: string }>;
}

export const AutoForm = <T extends object>({
  idKey = 'id' as keyof T,
  data,
  columns,
  className,
  style,
  autoRedirect,
  showSuccess,
  showSubmitButton = true,
  labelLocation = 'left',
  redirectUrl,
  onChange: handleChange,
  onUpdate,
  onInsert,
  onSubmit,
  children,
  ...props
}: IAutoFormProps<T>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    state: { wasItem, tooltips },
    setMergedState,
  } = useMergedState<IState<T>>({
    wasItem: Object.assign({}, data),
    tooltips: [],
  });

  const formRef = useRef<Form>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const validator = formRef.current?.instance?.validate();
      if (!validator?.isValid) {
        warning('Заполните обязательные поля');
        return false;
      }
      if (onSubmit) {
        return onSubmit(e, data);
      }
      const isNew = !data[idKey];
      if ((isNew && onInsert) || (!isNew && onUpdate)) {
        try {
          const res = isNew ? await onInsert?.(data) : await onUpdate?.(data[idKey] as string, data);
          if (showSuccess) {
            success('Данные успешно сохранены');
          }
          setMergedState({ wasItem: data });
          const id = res?.[idKey] as T[keyof T];
          if (isNew && !!id) {
            const b = {} as Record<keyof T, T[keyof T]>;
            b[idKey] = id;
            handleChange?.(b);
          }
          if (isNew && autoRedirect) {
            navigate(redirectUrl ? `${redirectUrl}/${id}` : pathname.replace(/\/([^/]*)$/, `/${id}`));
          }
        } catch (e) {}
      }
    },
    [
      pathname,
      navigate,
      setMergedState,
      autoRedirect,
      formRef,
      data,
      showSuccess,
      redirectUrl,
      idKey,
      handleChange,
      onSubmit,
      onInsert,
      onUpdate,
    ],
  );

  const filteredColumns = useMemo(() => {
    return columns.filter((v) => !v.invisible && !v.editInvisible);
  }, [columns]);

  const handleContentReady = useCallback<NonNullable<IFormOptions['onContentReady']>>(
    ({ element }) => {
      const array = filteredColumns.filter((v) => v.tooltip);
      const columnsByKey = keyBy(array, 'dataField');
      try {
        if (array.length) {
          const obj = {} as Record<string, string>;
          element.querySelectorAll('.dx-item-content').forEach((v) => {
            const label = v.querySelector('.dx-field-item-label');
            if (label) {
              let input = v.querySelector('.dx-texteditor-input-container input');
              if (!input?.getAttribute('name')) {
                input = v.querySelector('input[type="hidden"]');
              }
              const name = input?.getAttribute('name');
              if (name && columnsByKey[name] && !obj[name]) {
                obj[name] = name;
                const node = document.createElement('I');
                node.id = name;
                node.className = 'dx-icon dx-icon-help';
                label.append(node);
              }
            }
          });
          if (Object.keys(obj).length) {
            setMergedState({
              tooltips: Object.keys(obj).map((key) => ({
                dataField: key,
                text: columnsByKey[key].tooltip as string,
                target: `#${key}`,
                key: `#${key}`,
              })),
            });
          }
        }
      } catch (e) {}
    },
    [filteredColumns, setMergedState],
  );

  return (
    <form onSubmit={handleSubmit} className={cn('auto-form', { [className as string]: !!className })} style={style}>
      <Prompt
        when={!!wasItem[idKey] && !isEqual(wasItem, data)}
        message={'Вы изменили данные, но не сохранили. Уверены, что хотите уйти со страницы без сохранения?'}
      />
      <FormData<T>
        {...props}
        labelLocation={labelLocation}
        filteredColumns={filteredColumns}
        ref={formRef}
        data={data}
        onChange={handleChange}
        onContentReady={handleContentReady}
      />

      {tooltips.map((v) => (
        <DxTooltip key={v.key} showEvent="dxhoverstart" hideEvent="dxhoverend" target={v.target}>
          {v.text}
        </DxTooltip>
      ))}

      <div className="auto-form__buttons">
        {showSubmitButton ? (
          <Tooltip title="Сохранить" placement="left">
            <Button type="primary" shape="circle" icon={<SaveOutlined />} htmlType="submit" />
          </Tooltip>
        ) : null}
        {children}
      </div>
    </form>
  );
};

export const AutoFormMemo = memo(AutoForm) as unknown as typeof AutoForm;

export const AutoFormObservable = observer(AutoForm);
