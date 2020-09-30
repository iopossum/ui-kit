import React, { useCallback } from 'react';
import { LoginForm } from './index';
import { success } from '../../utils/Api';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo, withStores, withRouter } from '../../../.storybook/decorators';

export default {
  title: 'Login',
  component: LoginForm,
  decorators: [
    withKnobs,
    withInfo(),
    withRouter,
    withStores
  ]
};

export const Компонент = () => {

  return (
    <LoginForm
      className={text("className", "")}
      style={object("style", {})}
      onSubmit={() => success("Запрос на логин может быть отправлен")}
      hasRegLink={boolean('hasRegLink', true)}
    />
  );
};


