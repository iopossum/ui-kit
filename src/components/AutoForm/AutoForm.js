import React, { useCallback, useEffect, useMemo, useRef, memo, forwardRef } from 'react';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf, element } from 'prop-types';
import { useMergedState } from '@hooks';
import { success, warning, history } from '@utils/Api';
import { isEqual, keyBy } from 'lodash-es';
import { Prompt, useRouteMatch } from 'react-router-dom';
import cn from 'classnames';
import { Tooltip } from '@components/Tooltip';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SaveIcon from '@material-ui/icons/Save';
import { Tooltip as DevextremeTooltip } from 'devextreme-react/tooltip';
import { FormData } from './FormData';

import './AutoForm.scss';

export const AutoForm = ({
  className,
  style,
  autoRedirect,
  showSuccess,
  showSubmitButton,
  redirectUrl,
  useItem,
  onSubmit,
  children,
  ...props
}) => {

  const { currentItem, changeItem, columns, update, insert } = useItem();
  const match = useRouteMatch();

  const {
    state: {
      // formRef,
      wasItem,
      tooltips
    },
    setMergedState
  } = useMergedState({
    wasItem: Object.assign({}, currentItem),
    tooltips: []
  });

  const formRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const validator = formRef.current.instance.validate();
    if (!validator.isValid) {
      warning("Заполните обязательные поля");
      return false;
    }
    if (onSubmit) {
      return onSubmit(currentItem);
    }
    try {
      const isNew = !currentItem.id;
      const res = isNew ? await insert(currentItem) : await update(currentItem);
      if (showSuccess) {
        success("Данные успешно сохранены");
      }
      setMergedState({ wasItem: currentItem });
      if (isNew) {
        changeItem && changeItem({id: res.id});
      }
      if (isNew && autoRedirect) {
        history.push(redirectUrl ? `${redirectUrl}/${res.id}` : match.path.replace(':id', res.id));
      }
    } catch (e) {
      console.log(e)
    }
  }, [formRef, currentItem, showSuccess, autoRedirect, redirectUrl]);

  const filteredColumns = useMemo(() => {
    return columns.filter(v => !v.invisible && !v.editInvisible);
  }, []);

  const onContentReady = useCallback(({ element }) => {
    const array = filteredColumns.filter(v => v.tooltip);
    const columnsByKey = keyBy(array, 'dataField');
    try {
      if (array.length) {
        const obj = {};
        /*const inputs = element.querySelectorAll('.dx-texteditor-input-container input');
        const inputs2 = element.querySelectorAll('input[type="hidden"]');
        inputs.forEach(v => {
          if (columnsByKey[v.name]) {
            obj[v.name] = v.id;
          }
        });
        inputs2.forEach(v => {
          if (columnsByKey[v.name]) {
            const nodes = v.parentNode.querySelectorAll('.dx-texteditor-input-container input');
            nodes.forEach(c => {
              obj[v.name] = c.id;
            });
          }
        });*/
        element.querySelectorAll('.dx-item-content').forEach(v => {
          const label = v.querySelector('.dx-field-item-label');
          if (label) {
            let input = v.querySelector('.dx-texteditor-input-container input') || {};
            if (!input.name) {
              input = v.querySelector('input[type="hidden"]');
            }
            if (columnsByKey[input.name] && !obj[input.name]) {
              obj[input.name] = input.name;
              const node = document.createElement('I');
              node.id = input.name;
              node.className = 'dx-icon dx-icon-help';
              label.append(node)
            }
          }
        });
        if (Object.keys(obj).length) {
          setMergedState({
            tooltips: Object.keys(obj).map(key => ({
              dataField: key,
              text: columnsByKey[key].tooltip,
              target: `#${key}`
              // target: `.dx-item-content label[for="${obj[key]}"] .dx-field-item-label-content`
            }))
          })
        }
      }
    } catch(e) {}
  }, [filteredColumns]);

  return (
    <form onSubmit={handleSubmit} className={cn('auto-form', {[className]: !!className})} style={style}>
      <Prompt
        when={!!wasItem.id && !isEqual(wasItem, currentItem)}
        message={location => 'Вы изменили данные, но не сохранили. Уверены, что хотите уйти со страницы без сохранения?'}
      />
      <FormData
        {...props}
        filteredColumns={filteredColumns}
        ref={formRef}
        data={{...currentItem}}
        onChange={changeItem}
        onContentReady={onContentReady}
      />

      { tooltips.map(v => (
        <DevextremeTooltip
          key={v.target}
          showEvent="dxhoverstart"
          hideEvent="dxhoverend"
          target={v.target}
        >
          {v.text}
        </DevextremeTooltip>
      )) }

      <div className="auto-form__buttons">
        {showSubmitButton && (
          <Tooltip tooltipContent="Сохранить" position="left">
            <SpeedDial
              ariaLabel="SpeedDial"
              hidden={false}
              icon={<SaveIcon />}
              onClick={handleSubmit}
              open={false}
              style={{ marginLeft: 10 }}
            />
          </Tooltip>
        )}
        { children }
      </div>
    </form>
  );
};

AutoForm.propTypesConstants = {
  labelLocation: FormData.propTypesConstants.labelLocation
};

AutoForm.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Автоматический редирект по урлу после создания */
  autoRedirect: bool,
  /** Редирект по указанному урлу после создания */
  redirectUrl: string,
  /** Показывать сообщение об успешном выполнении запроса */
  showSuccess: bool,
  /** Показывать кнопку сохранения */
  showSubmitButton: bool,
  /** onSubmit callback */
  onSubmit: func,
  /** store item function */
  useItem: func,
  /** children */
  children: node,
  /** labelLocation */
  labelLocation: FormData.propTypes.labelLocation,
  /** dataPropCanChanged */
  dataPropCanChanged: FormData.propTypes.dataPropCanChanged,
  /** grouped */
  grouped: FormData.propTypes.grouped,
};

AutoForm.defaultProps = {
  autoRedirect: true,
  showSuccess: false,
  showSubmitButton: true,
  labelLocation: FormData.defaultProps.labelLocation,
  grouped: FormData.defaultProps.grouped,
};
