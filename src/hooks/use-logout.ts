import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useStores, createAppStore } from '@stores/index';
import { logout } from '@utils/api';

interface IUseLogout {
  (): {
    onLogout: () => void;
  };
}

export const useLogout: IUseLogout = () => {
  const history = useHistory();
  const { AppStore }: { AppStore: ReturnType<typeof createAppStore> } = useStores();
  const onLogout = useCallback(() => {
    logout(history);
    AppStore.removeToken();
  }, [history, AppStore]);
  return { onLogout };
};