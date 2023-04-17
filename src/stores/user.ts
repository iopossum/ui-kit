import { useStores } from '@stores/context';
import { get, post, errorHandler, IResponse } from '@utils/api';
import { getCookie } from '@utils/cookie';

export interface IUserStore<IUser> {
  baseUrl: string;
  _currentUser: IUser | null;
  currentUser: IUser;
  cookiePrefix?: string;
  profile: () => void;
  login: <T, K>(e: T) => Promise<IResponse<K> | undefined>;
  reg: <T, K>(e?: T) => Promise<IResponse<K> | undefined>;
  hasRole: (role: string, realmKey: string) => boolean;
}

export type UserStoreProps = {
  cookiePrefix: string;
  baseUrl?: string;
};

export const createUserStore = <T extends UserStoreProps, IUser>(props?: T) => {
  const { baseUrl = '/api/users', cookiePrefix = '', ...rest } = props || ({} as T);
  const store: IUserStore<IUser> = {
    baseUrl,
    cookiePrefix,
    _currentUser: null,
    get currentUser() {
      return this._currentUser as IUser;
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
        const data = await get<IUser>({ url: `${this.baseUrl}/${id}` });
        this.currentUser = data.body as IUser;
      } catch (e) {
        errorHandler({ showToast: true, throwable: true }, e);
      }
    },
    login: async function <T, K>(body: T) {
      try {
        return await post<T, K>({ url: `${this.baseUrl}/login`, body });
      } catch (e) {
        errorHandler<false>(
          {
            showToast: true,
            throwable: true,
            message: 'Неверный логин/пароль',
          },
          e,
        );
      }
    },
    reg: async function (body) {
      try {
        return await post({ url: baseUrl, body });
      } catch (e) {
        errorHandler({ showToast: true, throwable: true }, e);
      }
    },
    hasRole: function (role, realmKey = 'realm') {
      return this.currentUser && this.currentUser[realmKey as keyof IUser] === role;
    },
  };
  return {
    ...store,
    ...rest,
  };
};

export const useUserStore = <T>() => {
  const stores = useStores<{ UserStore: IUserStore<T> }>();
  return stores.UserStore;
};

export const useUserStoreProfile = <T>() => {
  const store = useUserStore<T>();
  return {
    currentUser: store.currentUser,
  };
};
