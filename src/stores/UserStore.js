import React from 'react';
import { get, post, errorHandler } from '@utils/Api';
import { getCookie } from '@utils/Cookie';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '@stores/index';

export const createUserStore = ({ baseUrl = '/api/users', cookiePrefix = '', ...opts } = {}) => ({
  baseUrl,
  cookiePrefix,
  _currentUser: null,
  get currentUser() {
    return this._currentUser;
  },
  set currentUser(u) {
    this._currentUser = u;
  },
  profile: async function () {
    const id = getCookie(`${this.cookiePrefix}user`);
    if (!id) {
      throw new Error('');
    }
    try {
      const data = await get({url: `${this.baseUrl}/${id}`});
      this.currentUser = data.body;
    } catch(e) {
      errorHandler({showToast: true, throwable: true}, e);
    }
  },
  login: async function (body) {
    try {
      return await post({url: `${this.baseUrl}/login`, body});
    } catch(e) {
      errorHandler({showToast: true, throwable: true, message: 'Неверный логин/пароль'}, e && e.response && e.response.status === 401 ? null : e);
    }
  },
  reg: async function (body) {
    try {
      return await post({url: baseUrl, body});
    } catch(e) {
      errorHandler({showToast: true, throwable: true}, e);
    }
  },
  hasRole: function (v, realmKey = 'realm') {
    return this.currentUser && this.currentUser[realmKey] === v;
  },
  ...opts
});

export const useUserStore = () => {
  const stores = useStores();
  return stores.UserStore;
};

export const useUserStoreProfile = () => {
  const store = useUserStore();
  return useObserver(() => ({
    currentUser: store.currentUser
  }));
};
