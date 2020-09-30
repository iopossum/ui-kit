import React from 'react';
import AbortController from "abort-controller";
import { getCookie } from '@utils/Cookie';
import notify from 'devextreme/ui/notify';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import { locale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';

const unknownErrorMessage = "Неверная конфигурация сервера";

const options = (method) => {
  const headers = {
    'Content-type': 'application/json'
  };
  const cookiePrefix = window.cookiePrefix || '';
  const token = getCookie(`${cookiePrefix}token`);
  if (token) {
    headers.Authorization = `${token}`;
  }

  return {
    method: method,
    headers,
  };
};

export const initLocales = () => {
  moment.locale('ru');
  loadMessages(ruMessages);
  locale('ru');
};

export const history = createBrowserHistory();

export function errorHandler(opts, res) {
  const {showToast, fn, message, throwable} = opts;
  res = res || {};
  let _messages = [];
  if (showToast) {
    if (res.body && !res.abort) {
      if (res.body.messages) {
        _messages = res.body.messages.map(v => v.message);
      } else if (res.body.error && res.body.error.message) {
        _messages = [res.body.error.message];
      } else {
        _messages = [res.body.message || message];
      }
    } else if (message || res.message) {
      _messages = [message || res.message];
    }
    if (_messages.length) {
      _messages.forEach(v => error(v));
    }
  }
  if (throwable && !res.abort && !(res instanceof DOMException)) {
    throw _messages.length ? new Error(_messages[0]) : res;
  }
  return fn && fn(res);
}

export const get = async (data) => {
  const {opts} = data;
  const config = options('GET');
  Object.assign(config, opts || {});
  return await request({...data, options: config});
};

export const put = async (data) => {
  const {body, opts} = data;
  const config = options('PUT');
  Object.assign(config, opts || {});
  config.body = JSON.stringify(body);
  return await request({...data, options: config});
};

export const post = async (data) => {
  const {body, opts} = data;
  const config = options('POST');
  Object.assign(config, opts || {});
  config.body = JSON.stringify(body);
  return await request({...data, options: config});
};

export const del = async (data) => {
  const {opts} = data;
  const config = options('DELETE');
  Object.assign(config, opts || {});
  return await request({...data, options: config});
};

const abortControllers = {};

export const abort = (key) => {
  if (abortControllers[key]) {
    abortControllers[key].abort();
  }
};

export const abortAll = () => {
  for (let key in abortControllers) {
    abort(key);
  }
};

const request = async ({url, options, noAbort, abortName, abortController, cache}) => {
  if (cache && cache[url]) {
    return cache[url];
  }
  const abortKey = abortName || url;
  if (!noAbort) {
    if (abortControllers[abortKey]) {
      abortControllers[abortKey].abort();
    }
    abortControllers[abortKey] = abortController || new AbortController();
    options.signal = abortControllers[abortKey].signal;
  }

  let response = null;
  let parsedResponse = null;
  const isText = options.isText;
  try {
    response = await fetch(`${process.env.HOST}${url}`, options);
    if (response.status === 404) {
      throw new Error(unknownErrorMessage);
    }
  } catch (err) {
    return Promise.reject({body: err, response, abort: err instanceof DOMException});
  }

  try {
    parsedResponse = !isText ? await response.json() : await response.text();
  } catch(e) {}

  if (!parsedResponse) {
    try {
      parsedResponse = isText ? await response.json() : await response.text();
    } catch(e) {}
  }

  if (!response.status || response.status >= 400) {
    if (response.status === 401) {
      abortAll();
      logout();
      return Promise.reject({body: new Error("Доступ запрещен или истек срок токена авторизации"), response, abort: true});
    }
    return Promise.reject({body: parsedResponse || new Error(unknownErrorMessage), response});
  }
  if (cache) {
    cache[url] = {body: parsedResponse, response};
  }
  return Promise.resolve({body: parsedResponse, response});
};

export const logout = () => {
  if (history.location.pathname !== '/login') {
    history.push('/login');
  }
};

export const buildToast = (message, type = 'info') => {
  const toasts = document.querySelectorAll('.dx-toast-content');
  let top = 0;
  if (toasts.length) {
    const element = toasts[toasts.length - 1];
    let rect = element.getBoundingClientRect();
    top += (rect.top + rect.height + 10);
  } else {
    top = 20;
  }
  notify({
    closeOnClick: true,
    message,
    position: {
      my: "top right",
      at: "top right",
      of: null,
      offset: "0 +" + top
    },
    maxWidth: 300,
    type,
    displayTime: 5000,
    elementAttr: { class: "toast" }
  });
};

export const error = (message) => {
   buildToast(message, 'error');
};

export const success = (message) => {
   buildToast(message, 'success');
};

export const warning = (message) => {
   buildToast(message, 'warning');
};
