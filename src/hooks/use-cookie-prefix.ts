import { useStores, createAppStore } from '@stores/index';

interface IUseCookiePrefix {
  (name: string): string;
}

export const useCookiePrefix: IUseCookiePrefix = (name) => {
  const { AppStore }: { AppStore: ReturnType<typeof createAppStore> } = useStores();
  return `${AppStore.cookiePrefix || ''}${name}`;
};