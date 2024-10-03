import React, { useCallback, memo, ChangeEventHandler } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';

import cn from 'classnames';

import { AuthWrapper } from '@components/auth-wrapper';
import { Button } from '@components/button';
import { CheckBox } from '@components/checkbox';
import { FloatLabelInput } from '@components/float-label-input';
import { IWithStyles, IField } from '@types';
import { warning } from '@utils/api';
import { getInitialValues, getFieldsMap } from '@utils/form';

import './login-form.scss';

export interface ILoginFormData {
  login: string;
  password: string;
  remember: boolean;
}

const fields: IField<ILoginFormData>[] = [
  { field: 'login', defaultValue: '', rules: { required: true } },
  { field: 'password', defaultValue: '', rules: { required: true } },
  { field: 'remember', defaultValue: true, rules: { required: false } },
];

const initialValues = getInitialValues<ILoginFormData>(fields);

const fieldsMap = getFieldsMap<ILoginFormData>(fields);

export interface ILoginFormProps extends IWithStyles {
  hasRegLink?: boolean;
  hasRemember?: boolean;
  regLink?: string;
  loginLabel?: string;
  onSubmit: SubmitHandler<ILoginFormData>;
  onValidationFailed?: SubmitErrorHandler<ILoginFormData>;
}

export const LoginForm = ({
  className,
  style,
  hasRegLink,
  hasRemember,
  regLink = '/reg',
  loginLabel = 'Логин (e-mail)',
  onSubmit,
  onValidationFailed,
}: ILoginFormProps) => {
  const handleValidationFailed = useCallback<SubmitErrorHandler<ILoginFormData>>(
    (values) => {
      if (onValidationFailed) {
        return onValidationFailed(values);
      }
      warning('Введите логин и пароль');
    },
    [onValidationFailed],
  );

  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    setValue,
  } = useForm<ILoginFormData>({
    defaultValues: initialValues,
    mode: 'onBlur',
    values: fields.reduce((sum, v) => {
      sum[v.field] = v.defaultValue;
      return sum;
    }, Object.create({})),
  });

  const handleChangeRemember = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setValue('remember', e.target.checked, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    },
    [setValue],
  );

  return (
    <AuthWrapper className={cn('login', { [className as string]: !!className })} style={style} header="Авторизация">
      <form noValidate onSubmit={handleSubmit(onSubmit, handleValidationFailed)}>
        <Controller<ILoginFormData>
          name="login"
          control={control}
          rules={fieldsMap['login'].rules}
          render={({ field: { ref, value, ...rest } }) => (
            <FloatLabelInput
              label={loginLabel}
              required
              status={errors.login ? 'error' : undefined}
              autoComplete="login"
              autoFocus
              size="large"
              fullWidth
              value={value as string}
              {...rest}
            />
          )}
        />
        <Controller<ILoginFormData>
          name="password"
          control={control}
          rules={fieldsMap['password'].rules}
          render={({ field: { ref, value, ...rest } }) => (
            <FloatLabelInput
              label="Пароль"
              type="password"
              required
              fullWidth
              size="large"
              status={errors.password ? 'error' : undefined}
              autoComplete="password"
              value={value as string}
              {...rest}
            />
          )}
        />
        {hasRemember ? (
          <Controller<ILoginFormData>
            name="remember"
            control={control}
            rules={fieldsMap['remember'].rules}
            render={({ field: { ref, value, ...rest } }) => (
              <CheckBox
                {...rest}
                label="Запомнить"
                className="login__remember"
                value={value as boolean}
                onChange={handleChangeRemember}
              />
            )}
          />
        ) : null}
        <Button
          text="Войти"
          type="default"
          elementAttr={{ class: 'login__submit' }}
          stylingMode="outlined"
          loading={isSubmitting}
          useSubmitBehavior
        />
        {hasRegLink && !!regLink ? (
          <Link to={regLink} className="login__reg">
            Регистрация
          </Link>
        ) : null}
      </form>
    </AuthWrapper>
  );
};

export const LoginFormMemo = memo(LoginForm);
