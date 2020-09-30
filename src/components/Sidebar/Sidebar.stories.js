import React from 'react';
import { Sidebar } from './index';
import { withKnobs, text, object, button, array, boolean  } from "@storybook/addon-knobs";
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { withRouter, withInfo, routes } from '../../../.storybook/decorators';

export default {
  title: 'Sidebar (Левое меню)',
  component: Sidebar,
  decorators: [
    withKnobs,
    withInfo(),
    withRouter,
  ],

};

export const Компонент = () => {
  const b = button('Добавить роут', () => {
    routes[1].children = routes[1].children || [];
    routes[1].children.push({id: Math.random(), title: 'Новый роут', displayOnSidebar: true})
  });
  const a = array('Роуты', routes.map(v => v.title));
  return (
    <Sidebar
      className={text("className", "")}
      style={object("style", {})}
      routes={a.map((v, i) => ({...routes[i], title: v, displayOnSidebar: true}))}
      showLogo={boolean("showLogo", true)}
      onLogout={() => alert('logout')}
      cookiePrefix={text("cookiePrefix", "storybook_")}
    />
  );
};


