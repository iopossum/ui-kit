export type TSimpleStoreItem = {
  id: number;
};

export const routes = [
  {
    title: 'Аптеки',
    path: '/reports',
    displayOnSidebar: true,
    abstract: true,
    children: [{ title: 'Отчеты', path: '/reports', displayOnSidebar: true }],
  },
  {
    title: 'Статистика',
    path: '/stats',
    displayOnSidebar: true,
    icon: 'dx-icon-chart',
  },
  {
    title: 'Тест',
    path: '/test',
    displayOnSidebar: true,
  },
  {
    title: 'Тест',
    path: '/test2',
    displayOnSidebar: true,
    children: [{ title: 'Отчеты', path: '/reports', displayOnSidebar: true }],
  },
  {
    title: 'Тест',
    path: '/test3',
    displayOnSidebar: true,
  },
  {
    title: 'Тест',
    path: '/test4',
    displayOnSidebar: true,
  },
  {
    title: 'Тест',
    path: '/test5',
    displayOnSidebar: true,
  },
];

export const data = [
  {
    ID: 1,
    CompanyName: 'Super Mart of the West',
    City: 'Bentonville',
    State: 'Arkansas',
  },
  {
    ID: 2,
    CompanyName: 'Electronics Depot',
    City: 'Atlanta',
    State: 'Georgia',
  },
  {
    ID: 3,
    CompanyName: 'K&S Music',
    City: 'Minneapolis',
    State: 'Minnesota',
  },
];

export const columns = [
  {
    dataField: 'ID',
    visible: true,
    caption: 'ID',
  },
  {
    dataField: 'CompanyName',
    visible: true,
    caption: 'CompanyName',
  },
  {
    dataField: 'City',
    visible: true,
    caption: 'City',
  },
  {
    dataField: 'State',
    visible: false,
    caption: 'State',
  },
];
