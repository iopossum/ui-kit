import AbortController from 'abort-controller';
import { locale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';
import notify from 'devextreme/ui/notify';
import { createBrowserHistory } from 'history';

import { getCookie } from '@utils/cookie';

export const UNKNOWN_ERROR_MESSAGE = 'Неверная конфигурация сервера';
export const UNAUTHORIZED_ERROR_MESSAGE = 'Доступ запрещен или истек срок токена авторизации';

export interface IErrorHandlerCfg {
  showToast?: boolean;
  message?: string;
  throwable?: boolean;
  fn?: (res?: unknown) => unknown;
}

export interface IResponseErrorBodyDetailed {
  code: string;
  message?: string;
  info?: {
    additionalProperty: string;
  };
}

export interface IResponseErrorBody {
  message?: string;
  messages?: Array<{ message: string }>;
  error?: {
    details?: IResponseErrorBodyDetailed[];
    code?: string;
    message?: string;
  };
}

export interface IResponseAdditional {
  response: Response;
  aborted?: boolean;
  message?: string;
}

export interface IResponse<T> extends IResponseAdditional {
  body: T;
}

export interface IRequestCfg {
  abortable?: boolean;
  abortName?: string;
  abortController?: InstanceType<typeof AbortController>;
  cached?: Record<string, unknown>;
  isText?: boolean;
  autoLogout?: boolean;
}

export interface IRequestProps<T> extends Omit<Partial<Request>, 'cache' | 'body'>, IRequestCfg {
  url: string;
  body?: T;
}

export type NotifyType = 'info' | 'error' | 'success' | 'warning';

const options = (method: Request['method']) => {
  const headers = new Headers();
  headers.append('Content-type', 'application/json');
  const cookiePrefix = (window as typeof window & { cookiePrefix?: string }).cookiePrefix || '';
  const token = getCookie(`${cookiePrefix}token`);
  if (token) {
    headers.append('Authorization', token);
  }

  return {
    method,
    headers,
  };
};

export const initLocales = (): void => {
  loadMessages(ruMessages);
  locale('ru');
};

export const history: ReturnType<typeof createBrowserHistory> = createBrowserHistory();

export const getErrorMessages = (res: IResponse<IResponseErrorBody>, message?: string): string[] => {
  let messages: Array<string | undefined> = [];
  if (res.body && !res.aborted) {
    if (res.body.messages) {
      messages = res.body.messages.map((v) => v.message);
    } else if (res.body.error?.details?.length) {
      messages = res.body.error.details.map((v) => {
        let m = v.message;
        if (v.code === 'additionalProperties' && v.info?.additionalProperty) {
          if (res.body.error?.code) {
            m = `${res.body.error.code}: ${m}`;
          }
          m = `${m} - ${v.info.additionalProperty}`;
        }
        return m;
      });
    } else if (res.body.error?.message) {
      messages = [res.body.error.message];
    } else if (res.body.message || message) {
      messages = [res.body.message || message];
    }
  } else if (message || res.message) {
    messages = [message || res.message];
  }
  return messages.filter(Boolean) as string[];
};

export function errorHandler<T>(opts: IErrorHandlerCfg, res?: unknown): T extends boolean ? never : void {
  const { showToast, fn, message, throwable } = opts;
  const messages: Array<string> = getErrorMessages(res as IResponse<IResponseErrorBody>, message);
  if (showToast && messages.length) {
    messages.forEach((v) => error(v));
  }
  if (throwable && !(res as IResponse<IResponseErrorBody>).aborted && !(res instanceof DOMException)) {
    throw messages.length ? new Error(messages[0]) : res;
  }
  return fn?.(res) as T extends boolean ? never : void;
}

export const get = async <K>(props: IRequestProps<never>): Promise<IResponse<K>> => {
  return await request<never, K>(Object.assign(options('GET'), props));
};

export const put = async <T, K>(props: IRequestProps<T>): Promise<IResponse<K>> => {
  return await request<T, K>(Object.assign(options('PUT'), props, { body: JSON.stringify(props.body) }));
};

export const patch = async <T, K>(props: IRequestProps<T>): Promise<IResponse<K>> => {
  return await request<T, K>(Object.assign(options('PATCH'), props, { body: JSON.stringify(props.body) }));
};

export const post = async <T, K>(props: IRequestProps<T>): Promise<IResponse<K>> => {
  return await request<T, K>(Object.assign(options('POST'), props, { body: JSON.stringify(props.body) }));
};

export const del = async <K>(props: IRequestProps<never>): Promise<IResponse<K>> => {
  return await request<never, K>(Object.assign(options('DELETE'), props));
};

const abortControllers = {} as Record<string, InstanceType<typeof AbortController>>;

export const abort = (key: string): void => {
  if (abortControllers[key]) {
    abortControllers[key].abort();
  }
};

export const abortAll = (): void => {
  for (const key in abortControllers) {
    abort(key);
  }
};

export const request = async <T, K>(props: IRequestProps<T>): Promise<IResponse<K>> => {
  const { url, abortable, abortName, abortController, cached, isText, autoLogout, ...rest } = props;
  if (cached && cached[url]) {
    return cached[url] as Promise<IResponse<K>>;
  }
  const abortKey = abortName || url;
  if (abortable) {
    if (abortControllers[abortKey]) {
      abortControllers[abortKey].abort();
    }
    abortControllers[abortKey] = abortController || new AbortController();
    rest.signal = abortControllers[abortKey].signal as NonNullable<Request['signal']>;
  }

  let response = null;
  let parsedResponse = null;
  try {
    response = await fetch(`${process.env.HOST || ''}${url}`, rest as IRequestProps<T & URLSearchParams>);
  } catch (err) {
    return Promise.reject({
      body: err,
      response,
      aborted: err instanceof DOMException,
    });
  }

  try {
    parsedResponse = !isText ? await response.json() : await response.text();
  } catch (e) {}

  if (!parsedResponse) {
    try {
      parsedResponse = isText ? await response.json() : await response.text();
    } catch (e) {}
  }

  if (!response.status || response.status >= 400) {
    if (response.status === 401) {
      abortAll();
      autoLogout && logout(history);
      return Promise.reject({
        body: parsedResponse || new Error(UNAUTHORIZED_ERROR_MESSAGE),
        response,
      });
    }
    return Promise.reject({
      body: parsedResponse || new Error(UNKNOWN_ERROR_MESSAGE),
      response,
    });
  }
  if (cached) {
    cached[url] = { body: parsedResponse, response };
  }
  return Promise.resolve({ body: parsedResponse, response });
};

export const logout = (history: ReturnType<typeof createBrowserHistory>, loginPath?: string): void => {
  loginPath = loginPath || '/login';
  if (history.location.pathname !== loginPath) {
    history.push(loginPath);
  }
};

export const buildToast = (message: string, type: NotifyType = 'info'): void => {
  const toasts = document.querySelectorAll('.dx-toast-content');
  let top = 0;
  if (toasts.length) {
    const element = toasts[toasts.length - 1];
    const rect = element.getBoundingClientRect();
    top += rect.top + rect.height + 10;
  } else {
    top = 20;
  }
  notify({
    closeOnClick: true,
    message,
    position: {
      my: 'top right',
      at: 'top right',
      of: null,
      offset: '0 +' + top,
    },
    maxWidth: 300,
    type,
    displayTime: 5000,
    elementAttr: { class: 'toast' },
  });
};

export const error = (message: string): void => {
  buildToast(message, 'error');
};

export const success = (message: string): void => {
  buildToast(message, 'success');
};

export const warning = (message: string): void => {
  buildToast(message, 'warning');
};
