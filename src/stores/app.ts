import { useStores } from '@stores/context';
import { getCookie, setCookie, removeCookie } from '@utils/cookie';

export type SidebarSize = 'sm' | 'lg';
export interface IAppStore {
  _token: IToken | null;
  _loading: boolean;
  sidebar: SidebarSize;
  cookiePrefix: string;
  loading: boolean;
  token: IToken;
  removeToken: () => void;
  setEntity: <T extends IAppStore>(name: keyof T, value: unknown) => void;
  toggleSidebar: () => void;
  getFooterHeight: () => number;
  footer?: null | HTMLDivElement;
  userIdField?: string;
  matches?: Record<string, unknown>;
}

export type AppStoreProps = {
  cookiePrefix: string;
  userIdField?: string;
};

export interface IToken {
  id: string;
  [s: string]: string;
}

export const createAppStore = <T extends AppStoreProps>(props: T) => {
  const { cookiePrefix, ...rest } = props;
  const token = getCookie(`${cookiePrefix}token`);
  const cookieSidebar = getCookie(`${cookiePrefix}sidebar`);
  (window as typeof window & { cookiePrefix?: string }).cookiePrefix = cookiePrefix;
  const store: IAppStore = {
    _token: token !== 'undefined' ? token : null,
    _loading: false,
    sidebar: cookieSidebar !== 'undefined' ? cookieSidebar : 'lg',
    footer: null,
    cookiePrefix,

    matches: {},

    get loading() {
      return this._loading;
    },
    set loading(v) {
      this._loading = v;
    },

    get token() {
      return this._token as IToken;
    },
    set token(t: IToken) {
      this._token = t;
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
      Object.assign(this, { [name]: value });
    },

    toggleSidebar: function () {
      this.sidebar = this.sidebar === 'lg' ? 'sm' : 'lg';
      setCookie(`${cookiePrefix}sidebar`, this.sidebar);
    },

    getFooterHeight: function () {
      return (this.footer && this.footer?.offsetHeight) || 42;
    },
  };
  return {
    ...store,
    ...rest,
  };
};

export const useAppStore = () => {
  const stores = useStores<{ AppStore: IAppStore }>();
  return stores.AppStore;
};

export const useAppStoreLoading = () => {
  const AppStore = useAppStore();
  return {
    loading: AppStore.loading,
  };
};

export const useAppStoreToken = () => {
  const AppStore = useAppStore();
  return {
    token: AppStore.token,
  };
};

export const useAppStoreElements = () => {
  const AppStore = useAppStore();
  return {
    sidebar: AppStore.sidebar,
    footer: AppStore.footer,
    setEntity: AppStore.setEntity.bind(AppStore),
    toggleSidebar: AppStore.toggleSidebar.bind(AppStore),
    getFooterHeight: AppStore.getFooterHeight.bind(AppStore),
  };
};

export const useAppStoreMedia = () => {
  const AppStore = useAppStore();
  return {
    matches: AppStore.matches,
  };
};
