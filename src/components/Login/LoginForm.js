import React, { useCallback, useState, useEffect } from 'react';
import { AuthWrapper } from "@components/AuthWrapper";
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf, element } from 'prop-types';
import cn from 'classnames';
import { useSimpleForm } from '@hooks';
import { warning, history } from '@utils/Api';
import { useStores } from '@stores';
import { Checkbox } from '@components/Checkbox';
import { MaterialTextField } from '@components/MaterialTextField';
import Button from 'devextreme-react/button';
import { Link } from 'react-router-dom';

import './Login.scss';

const fields = [
  { field: 'login', defaultValue: '', required: true },
  { field: 'password', defaultValue: '', required: true },
  { field: 'remember', defaultValue: true, required: false },
];

export const LoginForm = ({
  className,
  style,
  loginField,
  passwordField,
  onSubmit,
  onValidationFailed,
  hasRegLink,
  loginLabel
}) => {

  const { AppStore, UserStore } = useStores();

  const onSubmitFn = useCallback(async (inputs) => {
    if (onSubmit) {
      return onSubmit(inputs);
    }
    AppStore.loading = true;
    try {
      const data = await UserStore.login({[passwordField]: inputs.password.value, [loginField]: inputs.login.value});
      AppStore.token = data.body;
      if (!inputs.remember.value) {
        window.onbeforeunload = AppStore.removeToken;
      }
      await UserStore.profile();
      history.push('/');
    } catch(e) {
      console.log(e);
    }
    AppStore.loading = false;
  }, []);

  const onValidationFailedFn = useCallback(() => {
    if (onValidationFailed) {
      return onValidationFailed(inputs);
    }
    warning('Введите логин и пароль');
  }, []);

  const { inputs, handleInputChange, handleSubmit } = useSimpleForm(fields, onSubmitFn, onValidationFailedFn);

  return (
    <AuthWrapper
      className={cn('login', {[className]: !!className})}
      style={style}
      header="Авторизация"
      onSubmit={handleSubmit}
    >
      <MaterialTextField
        name="login"
        label={loginLabel}
        required
        fullWidth
        hasError={inputs.login.invalid}
        value={inputs.login.value}
        autoComplete="login"
        autoFocus
        onChange={handleInputChange}
      />
      <MaterialTextField
        name="password"
        label="Пароль"
        type="password"
        required
        fullWidth
        hasError={inputs.password.invalid}
        value={inputs.password.value}
        autoComplete="password"
        onChange={handleInputChange}
      />
      <Checkbox
        value={inputs.remember.value}
        name="remember"
        onChange={handleInputChange}
        label="Запомнить"
        className="login__remember"
      />
      <Button
        text="Войти"
        type="default"
        elementAttr={{ class: "login__submit" }}
        stylingMode="outlined"
        useSubmitBehavior
      />
      { hasRegLink && <Link to="/reg" className="login__reg">Регистрация</Link> }
    </AuthWrapper>
  )
};

LoginForm.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Поле логина */
  loginField: string,
  /** Поле пароля */
  passwordField: string,
  /** onSubmit callback */
  onSubmit: func,
  /** hasReg */
  hasRegLink: bool,
  /** loginLabel */
  loginLabel: string,
};

LoginForm.defaultProps = {
  loginField: 'email',
  passwordField: 'password',
  hasRegLink: false,
  loginLabel: 'Логин (e-mail)'
};
