import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
// import _ from 'lodash';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { useStores } from '@stores';
import { errorHandler, logout, history } from '@utils/Api';
import AbortController from "abort-controller";

const validateField = (fieldObj, value) => {
  const result = {
    invalid: false,
    error: null
  };
  if (fieldObj.required && !value) {
    result.invalid = true;
    result.error = 'required';
  } else if (fieldObj.pattern && !fieldObj.pattern.test(value)) {
    result.invalid = true;
    result.error = 'pattern';
  }
  return result;
};

export const useMergedState = (initialState = {}) => {
  const [state, setState] = useState(initialState);
  const setMergedState = newState => setState(prevState => Object.assign({}, prevState, newState));
  return { state, setMergedState };
};

export const useSimpleForm = (fields, onSubmit = () => {}, onValidationFailed = () => {}) => {
  const initialState = {};
  fields.forEach(v => initialState[v.field] = {
    ...v,
    value: v.defaultValue || '',
    dirty: false,
    invalid: false,
  });
  const [inputs, setInputs] = useState(initialState);
  const handleInputChange = (event) => {
    event.persist && event.persist();
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: {
        ...inputs[event.target.name],
        dirty: true,
        ...validateField(inputs[event.target.name], value),
        value
      }}
    ));
  };
  const handleSelectChange = (value, { name }) => {
    setInputs(inputs => ({
      ...inputs,
      [name]: {
        ...inputs[name],
        dirty: true,
        ...validateField(inputs[name], value),
        value
      }}
    ));
  };
  const handleSubmit = (event) => {
    event.preventDefault && event.preventDefault();
    setInputs(inputs => ({...inputs, submitted: true}));
    fields.forEach(v => {
      Object.assign(inputs[v.field], validateField(inputs[v.field], inputs[v.field].value));
    });
    const isInvalid = Object.values(inputs).some(v => v.invalid);
    if (!isInvalid) {
      onSubmit(inputs);
    } else {
      onValidationFailed(inputs);
    }
  };
  const clearForm = () => {
    setInputs(initialState);
  };
  return {
    handleInputChange,
    inputs,
    handleSubmit,
    clearForm,
    handleSelectChange
  };
};

export const useDataSource = ({
  tableKey: key,
  loadMode,
  abortLoad = true,
  abortByKey = true,
  abortUpdate = false,
  abortInsert = false,
  abortRemove = false,
  paginate,
  ...props
}) => {

  const {createAbortControllers} = useAbortController();

  const dataSource = useRef(new DataSource({
    store: new CustomStore({
      key,
      load: (opts) => {
        if (!abortLoad) {
          return props.load(opts);
        }
        const ac = createAbortControllers();
        return props.load({...opts, abortController: ac[0]});
      },
      insert: props.insert ? (opts) => {
        if (!abortInsert) {
          return props.insert(opts);
        }
        const ac = createAbortControllers();
        return props.insert({...opts, abortController: ac[0]});
      } : props.insert,
      update: props.update ? (key, value) => {
        if (!abortUpdate) {
          return props.update(key, value);
        }
        const ac = createAbortControllers();
        return props.update({key, value, abortController: ac[0]});
      } : props.update,
      remove: props.remove ? (opts) => {
        if (!abortRemove) {
          return props.remove(opts);
        }
        const ac = createAbortControllers();
        return props.remove({...opts, abortController: ac[0]});
      } : props.remove,
      byKey: props.byKey ? (opts) => {
        if (!abortByKey) {
          return props.byKey(opts);
        }
        const ac = createAbortControllers();
        return props.byKey({...opts, abortController: ac[0]});
      } : props.byKey,
      loadMode: loadMode || 'processed'
    }),
    paginate
  }));

  return dataSource.current;

};

export const useDataTable = ({
  editable,
  dataGridToolbarIcons,
  createPath,
  dataSource,
  ...props
}) => {

  const match = useRouteMatch();

  const customizeExcelCell = useCallback((e) => {
    if (e.gridCell.rowType === 'totalFooter') {
      e.value = '';
    }
  }, []);

  const onToolbarPreparing = useCallback((e) => {
    if (dataGridToolbarIcons) {
      if (dataGridToolbarIcons.createByLink && editable) {
        e.toolbarOptions.items.unshift({
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'plus',
            hint: 'Создать',
            onClick: () => history.push(createPath || `${match.url}/create`)
          }
        });
      }
      /*if (props.dataGridToolbarIcons.upload && props.editable && !UserStore.hasRole('suser')) {
        e.toolbarOptions.items.unshift({
          location: 'after',
          widget: 'dxFileUploader',
          options: {
            accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
            allowedFileExtensions: ['.xls', '.xlsx', '.csv'],
            showFileList: false,
            hint: 'Загрузить',
            width: '36px',
            labelText: '',
            selectButtonText: '',
            uploadMode: 'useButtons',
            allowCanceling: false,
            onContentReady: (e) => {
              const node = document.createElement('I');
              node.className = 'dx-icon dx-icon-upload';
              e.element.querySelector('.dx-button-content').appendChild(node);
            },
            onValueChanged: async function (e) {
              if (e.value && e.value.length) {
                const exts = this.option('allowedFileExtensions');
                const isValid = exts.some(v => new RegExp(`${v}$`).test(e.value[0].name));
                if (!isValid) {
                  errorHandler({showToast: true, message: `Неверный формат файла. Докускаются форматы ${exts.join(', ')}`});
                  e.component.reset();
                  return false;
                }
                const results = [];
                try {
                  let rows = [];
                  if (/\.csv$/.test(e.value[0].name)) {
                    rows = await readCSV(e.value[0]);
                  } else {
                    rows = await readXLS(e.value[0]);
                  }
                  if (rows.length <= 1) {
                    errorHandler({showToast: true, message: 'Не удалось найти записи в файле'});
                    return false;
                  }
                  const columnsObj = _.keyBy(props.columns, 'caption');
                  const header = rows.splice(0, 1)[0];
                  if (!header) {
                    errorHandler({showToast: true, message: 'Неверный формат данных в файле. Первая строка должна содержать названия колонок'});
                    return false;
                  }
                  let headers = {};
                  header.forEach((name, index) => {
                    if (name && columnsObj[name]) {
                      headers[index] = columnsObj[name].dataField;
                    }
                  });
                  if (!Object.keys(headers).length) {
                    errorHandler({showToast: true, message: 'Неверный формат данных в файле. Первая строка должна содержать названия колонок'});
                    return false;
                  }
                  rows.forEach((row) => {
                    const json = {};
                    row.forEach((value, index) => {
                      if (headers[index]) {
                        json[headers[index]] = value;
                      }
                    });
                    if (Object.keys(json).length) {
                      results.push(json);
                    }
                  });
                } catch(e) {
                  errorHandler({showToast: true, message: e.message || 'Ошибка загрузки файла'});
                }

                if (!results.length) {
                  errorHandler({showToast: true, message: 'Неверный формат данных в файле'});
                  return false;
                }
                try {
                  await dataSource.store().insert(results);
                  dataSource.reload();
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        });
      }*/
      if (dataGridToolbarIcons.refresh) {
        e.toolbarOptions.items.unshift({
          location: 'after',
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            hint: 'Обновить',
            onClick: () => dataSource && dataSource.reload()
          }
        });
      }
    }
  }, []);

  return {onToolbarPreparing, customizeExcelCell};
};

export const useRequest = (fetchFn) => {
  const {
    state: {
      loading,
      error,
      response,
      loaded
    },
    setMergedState
  } = useMergedState({
    loading: false,
    error: null,
    response: null,
    loaded: false
  });

  const {createAbortControllers} = useAbortController();

  const request = useCallback(async function () {
    const ac = createAbortControllers();
    const mainArguments = Array.prototype.slice.call(arguments);
    mainArguments.push(ac[0]);
    setMergedState({ loading: true, error: null, loaded: false });
    try {
      const r = await fetchFn(...mainArguments);
      setMergedState({ loading: false, response: r, loaded: true });
      return r;
    } catch(e) {
      if (!e.abort) {
        setMergedState({loading: false, error: e, loaded: true});
      }
    }
  }, []);

  return {
    loading,
    error,
    response,
    request,
    loaded
  };
};

export const useQuery = () => new URLSearchParams(useLocation().search);

export const useTooltip = ({ disabled }) => {
  const [visible, setVisible] = useState(false);
  const onMouseEnter = useCallback(() => {
    !disabled && setVisible(true);
  }, [disabled]);
  const onMouseLeave = useCallback(() => {
    !disabled && setVisible(false);
  }, [disabled]);
  return {
    onMouseEnter,
    onMouseLeave,
    visible
  };
};

export const useLogout = (useStores) => {
  const history = useHistory();
  const { AppStore } = useStores();
  const onLogout = useCallback(() => {
    logout(history);
    AppStore.removeToken();
  }, [history]);
  return [onLogout];
};

export const useCookiePrefix = (name) => {
  const { AppStore } = useStores();
  return `${AppStore.cookiePrefix || ''}${name}`;
};

export const useAbortController = ({ initCount, abortOnUnmount = true } = {}) => {

  const abortControllersRef = useRef(initCount > 0 ? Array.from({ length: initCount }).map(() => new AbortController()) : []);

  useEffect(() => {
    return () => {
      abortOnUnmount && abortControllersRef.current.forEach(v => v.abort());
    };
  }, []);

  const createAbortControllers = ({ count, source } = {}) => {
    const array = Array.from({ length: count || 1 }).map(() => new AbortController());
    abortControllersRef.current = abortControllersRef.current.concat(array);
    return array;
  };

  return {abortControllersRef, createAbortControllers};
};
