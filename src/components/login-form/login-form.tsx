import React, { useCallback, memo } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import Button from 'devextreme-react/button';
import { useFormik } from 'formik';
import type { FormikConfig } from 'formik';

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

export interface ILoginFormProps extends Pick<FormikConfig<ILoginFormData>, 'onSubmit'>, IWithStyles {
  hasRegLink?: boolean;
  regLink?: string;
  loginLabel?: string;  
  onValidationFailed: IUseFormValidationCallback<ILoginFormData>['onValidationFailed'];
}

export const LoginForm = ({
  className,
  style,
  hasRegLink,
  regLink,
  loginLabel,
  onSubmit,
  onValidationFailed,
}: ILoginFormProps) => {

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
    onSubmit,
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
  loginLabel: 'Логин (e-mail)',  
  regLink: '/reg',
};

export const LoginFormMemo = memo(LoginForm);
