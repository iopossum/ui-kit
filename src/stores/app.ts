import { getCookie, setCookie, removeCookie } from '@utils/cookie';

export type TSidebarSize = 'sm' | 'lg';

export interface IAppStoreState {
  token: string | null;
  loading: boolean;
  sidebar: TSidebarSize;
  cookiePrefix: string;
  footer?: null | HTMLDivElement;
  userIdField?: string;
  matches?: Record<string, unknown>;
}
export interface IAppStore<T extends object = {}, K extends object = {}> {
  state: IAppStoreState & T;
  logout: () => void;
  setToken: (t: IToken) => void;
  toggleSidebar: () => void;
  getFooterHeight: () => number;
  setEntity: <Key extends keyof IAppStore<T, K>['state']>(key: Key, value: IAppStore<T, K>['state'][Key]) => void;
}

export type TAppStoreProps<T extends object = {}, K extends object = {}> = {
  state?: Partial<IAppStoreState> & {
    loginPath?: string;
  } & T;
} & Partial<Pick<IAppStore<T, K>, 'getFooterHeight' | 'logout' | 'setEntity' | 'setToken' | 'toggleSidebar'>> &
  K;

export interface IToken {
  id: string;
  [s: string]: string;
}

export const createAppStore = <T extends object = {}, K extends object = {}>(props: TAppStoreProps<T, K>) => {
  const { state, ...rest } = props;
  const { cookiePrefix, loginPath = '/login', ...stateRest } = state || {};
  const cookieToken = getCookie(`${cookiePrefix}token`);
  const cookieSidebar = getCookie(`${cookiePrefix}sidebar`);
  (window as typeof window & { cookiePrefix?: string }).cookiePrefix = cookiePrefix;
  const store: IAppStore<T, K> = {
    state: {
      token: cookieToken !== 'undefined' ? cookieToken : null,
      loading: false,
      sidebar: cookieSidebar !== 'undefined' ? cookieSidebar : 'lg',
      footer: null,
      cookiePrefix,

      matches: {},
      ...stateRest,
    } as IAppStore<T, K>['state'],

    setToken: function (t: IToken) {
      this.state.token = t.id;
      setCookie(`${cookiePrefix}token`, t.id);
      if (this.state.userIdField && t[this.state.userIdField]) {
        setCookie(`${cookiePrefix}user`, t[this.state.userIdField]);
      }
    },

    logout: function () {
      if (window.location.pathname !== loginPath) {
        this.state.token = null;
        removeCookie(`${cookiePrefix}token`);
        if (this.state.userIdField) {
          removeCookie(`${cookiePrefix}user`);
        }
        window.location.replace(loginPath);
      }
    },

    toggleSidebar: function () {
      this.state.sidebar = this.state.sidebar === 'lg' ? 'sm' : 'lg';
      setCookie(`${cookiePrefix}sidebar`, this.state.sidebar);
    },

    getFooterHeight: function () {
      return (this.state.footer && this.state.footer?.offsetHeight) || 42;
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
