import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
const history = createMemoryHistory({
  initialEntries: ['/'],
  getUserConfirmation(message, callback) {
    prompt(message)
  },
});
import { withInfo as rootWithInfo } from '@storybook/addon-info';
import { createUserStore, createAppStore, storeContext } from '../src/stores';
import { useLocalStore } from 'mobx-react-lite';

export const withStores = (story) => {
  const createStore = () => ({
    UserStore: createUserStore(),
    AppStore: createAppStore(),
    SampleStore: {
      currentItem: {id: 1}
    }
  });
  const StoresProvider = ({ children }) => {
    const store = useLocalStore(createStore);
    return <storeContext.Provider value={store}>{children}</storeContext.Provider>
  };
  return (
    <StoresProvider>
      {story()}
    </StoresProvider>
  );
};

export const withRouter = (story) => (
  <Router history={history}>
    <Route path="/" render={() => story()} />
  </Router>
);

export const withInfo = () => rootWithInfo({
  styles: {
    children: {
      position: 'static',
      display: 'flex',
      flex: 1,
      alignItems: 'flex-start'
    },
    button: {
      topRight: {
        right: 20,
      }
    }
  }
});

export const routes = [{
  title: 'Аптеки',
  path: '/reports',
  displayOnSidebar: true,
  abstract: true,
  children: [{ title: 'Отчеты', path: '/reports', displayOnSidebar: true, }]
}, {
  title: 'Статистика',
  path: '/stats',
  displayOnSidebar: true,
  icon: 'dx-icon-chart'
}, {
  title: 'Тест',
  path: '/test',
  displayOnSidebar: true,
}];
