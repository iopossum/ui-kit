import React, { useCallback, useEffect, useMemo, useRef, memo, forwardRef } from 'react';
import Form, {
  GroupItem,
  SimpleItem,
} from 'devextreme-react/form';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf, element } from 'prop-types';
import { groupBy } from 'lodash-es';

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3
};

const screenByWidth = (groups, width) => {
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

const getAttrs = (v) => {
  const attrs = {
    dataField: v.dataField,
    label: {text: v.caption},
    validationRules: [],
    editorOptions: {}
  };
  if (v.type === 'date') {
    attrs.editorType= 'dxDateBox';
    if (v.editorOptions) {
      attrs.editorOptions = v.editorOptions;
    }
  }
  if (v.textarea) {
    attrs.editorType= 'dxTextArea';
  }
  if (v.frontLookup) {
    attrs.editorType= 'dxSelectBox';
    attrs.editorOptions = v.editorOptions;
  }
  if (v.characters) {
    attrs.editorOptions.onInput = ({event, component}) => {
      const {value} = event.target;
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
        attrs.validationRules.push({ type: 'email', message: 'Неверный формат' });
        break;
    }
  }
  if (v.required) {
    attrs.validationRules.push({ type: 'required', message: 'Не заполнено поле' });
  }
  if (v.editable === false) {
    attrs.editorOptions.disabled = true;
  }
  return attrs;
};

export const FormData = memo(
  forwardRef(({
    filteredColumns,
    data,
    labelLocation,
    onChange,
    grouped,
    onContentReady
  }, ref) => {

    const groups = useMemo(() => {
      return !grouped || (grouped && !filteredColumns.some(v => v.group)) ? {} : groupBy(filteredColumns, 'group');
    }, [filteredColumns, grouped]);

    return (
      <Form
        labelLocation={labelLocation}
        ref={ref}
        colCountByScreen={colCountByScreen}
        screenByWidth={screenByWidth.bind(null, groups)}
        formData={{...data}}
        readOnly={false}
        showColonAfterLabel={true}
        showValidationSummary={false}
        // onFieldDataChanged={e => changeItem({[e.dataField]: e.value })}
        onFieldDataChanged={e => typeof e.value !== 'undefined' && onChange({[e.dataField]: e.value })}
        minColWidth={233}
        onContentReady={onContentReady}
      >
        { Object.keys(groups).length > 0 ? Object.keys(groups).map((key) => {
          return (
            <GroupItem key={key} caption={key !== 'undefined' ? key : null}>
              { groups[key].map(v => {
                const attrs = getAttrs(v);
                return (
                  <SimpleItem {...attrs} key={v.dataField} />
                )
              }) }
            </GroupItem>
          );
        }) : filteredColumns.map(v => {
          const attrs = getAttrs(v);
          return (
            <SimpleItem {...attrs} key={v.dataField} />
          )
        })}
      </Form>
    );
  }), (prev, cur) => {
    let notChanged = prev.labelLocation === cur.labelLocation;
    if (notChanged && cur.dataPropCanChanged) {
      const array = typeof cur.dataPropCanChanged === 'string' ? [cur.dataPropCanChanged] : cur.dataPropCanChanged;
      notChanged = array.every(key => prev.data[key] === cur.data[key]);
    }
    return notChanged;
});

FormData.propTypesConstants = {
  labelLocation: ['top', 'left', 'right']
};

FormData.propTypes = {
  /** filteredColumns */
  filteredColumns: array,
  /** data */
  data: object,
  /** grouped */
  grouped: bool,
  /** labelLocation */
  labelLocation: oneOf(FormData.propTypesConstants.labelLocation),
  /** dataPropCanChanged */
  dataPropCanChanged: oneOfType([string, array]),
  /** onChange callback */
  onChange: func,
  /** onContentReady callback */
  onContentReady: func
};

FormData.defaultProps = {
  filteredColumns: [],
  labelLocation: 'left',
  grouped: false,
  onContentReady: () => {}
};
