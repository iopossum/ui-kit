import React, { useCallback } from 'react';
import { AuthWrapper } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo } from '../../../.storybook/decorators';

export default {
  title: 'AuthWrapper',
  component: AuthWrapper,
  decorators: [
    withKnobs,
    withInfo()
  ]
};

export const Компонент = () => {

  return (
    <AuthWrapper
      className={text("className", "")}
      header={text("header", "Авторизация")}
      style={object("style", {})}
      onSubmit={() => {}}
    >
      Контент
    </AuthWrapper>
  );
};


