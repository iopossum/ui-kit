import { getCookie, setCookie, removeCookie } from '@utils/cookie';

export type SidebarSize = 'sm' | 'lg';
export interface IAppStore {
  token: string | null;
  loading: boolean;
  sidebar: SidebarSize;
  cookiePrefix: string;  
  footer?: null | HTMLDivElement;
  userIdField?: string;
  matches?: Record<string, unknown>;
  removeToken: () => void;  
  setToken: (t: IToken) => void;
  toggleSidebar: () => void;
  getFooterHeight: () => number;  
}

export type AppStoreProps = {
  cookiePrefix: string;
  userIdField?: string;
};

export interface IToken {
  id: string;
  [s: string]: string;
}

export const createAppStore = <T = {}>(props: T & AppStoreProps) => {
  type TK = T & IAppStore;
  const { cookiePrefix, ...rest } = props;
  const cookieToken = getCookie(`${cookiePrefix}token`);
  const cookieSidebar = getCookie(`${cookiePrefix}sidebar`);
  (window as typeof window & { cookiePrefix?: string }).cookiePrefix = cookiePrefix;
  const store: IAppStore = {
    token: cookieToken !== 'undefined' ? cookieToken : null,
    loading: false,
    sidebar: cookieSidebar !== 'undefined' ? cookieSidebar : 'lg',
    footer: null,
    cookiePrefix,

    matches: {},
    
    setToken: function (t: IToken) {
      this.token = t.id;
      setCookie(`${cookiePrefix}token`, t.id);
      if (this.userIdField && t[this.userIdField]) {
        setCookie(`${cookiePrefix}user`, t[this.userIdField]);
      }
    },

    removeToken: function () {
      this.token = null;
      removeCookie(`${cookiePrefix}token`);
      if (this.userIdField) {
        removeCookie(`${cookiePrefix}user`);
      }
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
    setEntity: function <K = TK[keyof TK]>(name: keyof TK, value: K) {
      Object.assign(this, { [name]: value });
    },
  };
};