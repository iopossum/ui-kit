import React, { useCallback, memo } from 'react';
import { Link, useHistory } from 'react-router-dom';

import cn from 'classnames';
import Button from 'devextreme-react/button';
import { useFormik } from 'formik';
import type { FormikConfig } from 'formik';

import { useStores, IAppStore, IUserStore, IToken } from '@stores';

import { AuthWrapper } from '@components/auth-wrapper';
import { CheckBox } from '@components/checkbox';
import { FloatLabelInput } from '@components/float-label-input';
import type { IUseFormValidationCallback } from '@hooks/use-form-validation-callback';
import { useFormValidationCallback } from '@hooks/use-form-validation-callback';
import { IWithStyles, IField } from '@types';
import { warning } from '@utils/api';
import { getInitialValues, createValidation } from '@utils/formik';

import './login-form.scss';

interface ILoginFormData {
  login: string;
  password: string;
  remember: boolean;
}

const fields: IField<ILoginFormData>[] = [
  { field: 'login', defaultValue: '', required: true },
  { field: 'password', defaultValue: '', required: true },
  { field: 'remember', defaultValue: true, required: false },
];

const initialValues = getInitialValues<ILoginFormData>(fields);

export interface ILoginFormProps extends IWithStyles {
  loginField?: string;
  passwordField?: string;
  hasRegLink?: boolean;
  regLink?: string;
  loginLabel?: string;
  defaultRedirectPath?: string;
  onSubmit?: (e: ILoginFormData) => void;
  onValidationFailed: IUseFormValidationCallback<ILoginFormData>['onValidationFailed'];
}

export const LoginForm = ({
  className,
  style,
  loginField,
  passwordField,
  defaultRedirectPath,
  hasRegLink,
  regLink,
  loginLabel,
  onSubmit,
  onValidationFailed,
}: ILoginFormProps) => {
  const { AppStore, UserStore } = useStores<{ AppStore: IAppStore; UserStore: IUserStore<unknown> }>();
  const history = useHistory();

  const onSubmitFn = useCallback<FormikConfig<ILoginFormData>['onSubmit']>(
    async (values) => {
      if (onSubmit) {
        return onSubmit(values);
      }
      AppStore.loading = true;
      try {
        const data = await UserStore.login<unknown, IToken>({
          [passwordField as string]: values.password,
          [loginField as string]: values.login,
        });
        AppStore.token = data?.body as NonNullable<IToken>;
        if (!values.remember) {
          window.onbeforeunload = AppStore.removeToken;
        }
        await UserStore.profile();
        if (defaultRedirectPath) {
          history.push(defaultRedirectPath);
        }
      } catch (e) {}
      AppStore.loading = false;
    },
    [onSubmit, UserStore, AppStore, history, passwordField, loginField, defaultRedirectPath],
  );

  const handleValidationFailed = useCallback<IUseFormValidationCallback<ILoginFormData>['onValidationFailed']>(
    (values) => {
      if (onValidationFailed) {
        return onValidationFailed(values);
      }
      warning('Введите логин и пароль');
    },
    [onValidationFailed],
  );

  const { handleSubmit, handleChange, values, errors, validateForm } = useFormik<ILoginFormData>({
    initialValues,
    validate: createValidation<ILoginFormData>(fields),
    onSubmit: onSubmitFn,
  });

  const [handleSubmitWrapper] = useFormValidationCallback({
    validateForm,
    handleSubmit,
    onValidationFailed: handleValidationFailed,
  });

  return (
    <AuthWrapper className={cn('login', { [className as string]: !!className })} style={style} header="Авторизация">
      <form noValidate onSubmit={handleSubmitWrapper}>
        <FloatLabelInput
          name="login"
          label={loginLabel}
          required
          status={errors.login && 'error'}
          value={values.login}
          autoComplete="login"
          autoFocus
          size="large"
          fullWidth
          onChange={handleChange}
        />
        <FloatLabelInput
          name="password"
          label="Пароль"
          type="password"
          required
          fullWidth
          size="large"
          status={errors.password && 'error'}
          value={values.password}
          autoComplete="password"
          onChange={handleChange}
        />
        <CheckBox
          value={values.remember}
          name="remember"
          onChange={handleChange}
          label="Запомнить"
          className="login__remember"
        />
        <Button
          text="Войти"
          type="default"
          elementAttr={{ class: 'login__submit' }}
          stylingMode="outlined"
          useSubmitBehavior
        />
        {hasRegLink && (
          <Link to={regLink} className="login__reg">
            Регистрация
          </Link>
        )}
      </form>
    </AuthWrapper>
  );
};

LoginForm.defaultProps = {
  loginField: 'email',
  passwordField: 'password',
  loginLabel: 'Логин (e-mail)',
  defaultRedirectPath: '/',
  regLink: '/reg',
};

export const LoginFormMemo = memo(LoginForm);