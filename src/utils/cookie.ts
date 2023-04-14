import Cookies, { CookieSetOptions, CookieGetOptions } from 'universal-cookie';

const cookie = new Cookies();

export const setCookie = (name: string, value: unknown, options?: CookieSetOptions): void => {
  cookie.set(name, value, { path: '/', ...options });
};

export const getCookie = (name: string, options?: CookieGetOptions) => {
  return cookie.get(name, options);
};

export const removeCookie = (name: string, options?: CookieSetOptions) => {
  cookie.remove(name, options);
};
