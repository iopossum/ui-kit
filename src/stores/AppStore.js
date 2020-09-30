import React from 'react';
import { getCookie, setCookie, removeCookie } from '@utils/Cookie';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '@stores/index';

export const createAppStore = ({ cookiePrefix, userIdField, ...opts } = {}) => {
  const token = getCookie(`${cookiePrefix}token`);
  const sidebar = getCookie(`${cookiePrefix}sidebar`);
  window.cookiePrefix = cookiePrefix;
  return {
    _token: token !== 'undefined' ? token : null,
    _loading: false,
    sidebar: sidebar !== 'undefined' ? sidebar : 'lg',
    footer: null,
    cookiePrefix,
    userIdField,

    matches: {},

    get loading() {
      return this._loading;
    },
    set loading(v) {
      this._loading = v;
    },

    get token() {
      return this._token;
    },
    set token(t) {
      this._token = t.id;
      setCookie(`${cookiePrefix}token`, t.id);
      if (this.userIdField && t[this.userIdField]) {
        setCookie(`${cookiePrefix}user`, t[this.userIdField]);
      }
    },

    removeToken: function () {
      this._token = null;
      removeCookie(`${cookiePrefix}token`);
      if (this.userIdField) {
        removeCookie(`${cookiePrefix}user`);
      }
    },

    setEntity: function (name, value) {
      this[name] = value;
    },

    toggleSidebar: function () {
      this.sidebar = this.sidebar === 'lg' ? 'sm' : 'lg';
      setCookie(`${cookiePrefix}sidebar`, this.sidebar);
    },

    getFooterHeight: function () {
      return this.footer && this.footer.offsetHeight || 42;
    },

    ...opts
  }
};

export const useAppStore = () => {
  const stores = useStores();
  return stores.AppStore;
};

export const useAppStoreLoading = () => {
  const AppStore = useAppStore();
  return useObserver(() => ({
    loading: AppStore.loading,
  }));
};

export const useAppStoreToken = () => {
  const AppStore = useAppStore();
  return useObserver(() => ({
    token: AppStore.token,
  }));
};

export const useAppStoreElements = () => {
  const AppStore = useAppStore();
  return useObserver(() => ({
    sidebar: AppStore.sidebar,
    footer: AppStore.footer,
    setEntity: AppStore.setEntity.bind(AppStore),
    toggleSidebar: AppStore.toggleSidebar.bind(AppStore),
    getFooterHeight: AppStore.getFooterHeight.bind(AppStore),
  }));
};

export const useAppStoreMedia = () => {
  const AppStore = useAppStore();
  return useObserver(() => ({
    matches: AppStore.matches,
  }));
};
