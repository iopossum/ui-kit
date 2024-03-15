import { get, post, errorHandler, IResponse } from '@utils/api';
import { getCookie } from '@utils/cookie';

export interface IUserStoreState<IUser> {
  baseUrl: string;
  currentUser: IUser | null;
  cookiePrefix?: string;
}

export interface IUserStore<IUser, T extends object = {}, K extends object = {}> {
  state: IUserStoreState<IUser> & T;
  profile: () => Promise<void>;
  login: <T, K>(e: T) => Promise<IResponse<K> | undefined>;
  reg: <T, K>(e?: T) => Promise<IResponse<K> | undefined>;
  hasRole: (role: string, realmKey: string) => boolean;
  setEntity: <Key extends keyof IUserStore<IUser, T, K>['state']>(
    key: Key,
    value: IUserStore<IUser, T, K>['state'][Key],
  ) => void;
}

export type UserStoreProps<IUser, T extends object = {}, K extends object = {}> = {
  state?: Partial<IUserStoreState<IUser>> & T;
} & Partial<Pick<IUserStore<IUser, T, K>, 'profile' | 'login' | 'setEntity' | 'hasRole' | 'reg'>> &
  K;

export const createUserStore = <IUser, T extends object = {}, K extends object = {}>(
  props?: UserStoreProps<IUser, T, K>,
) => {
  const { state, ...rest } = props || {};
  const { baseUrl = '/api/users', cookiePrefix = '', ...stateRest } = state || {};
  const store: IUserStore<IUser, T, K> = {
    state: {
      baseUrl,
      cookiePrefix,
      currentUser: null,
      ...stateRest,
    } as IUserStore<IUser, T, K>['state'],
    profile: async function () {
      const id = getCookie(`${this.state.cookiePrefix}user`);
      if (!id) {
        throw new Error('');
      }
      try {
        const data = await get<IUser>({ url: `${this.state.baseUrl}/${id}` });
        this.state.currentUser = data.body as IUser;
      } catch (e) {
        errorHandler({ showToast: true, throwable: true }, e);
      }
    },
    login: async function <T, K>(body: T) {
      try {
        return await post<T, K>({ url: `${this.state.baseUrl}/login`, body });
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
      return !!this.state.currentUser && this.state.currentUser[realmKey as keyof IUser] === role;
    },
    setEntity: function (name, value) {
      Object.assign(this, { [name]: value });
    },
  };
  return {
    ...store,
    ...rest,
  };
};
