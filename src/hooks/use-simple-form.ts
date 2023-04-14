import React, { useState, useCallback } from 'react';

import type { IField } from '@types';

interface IUseSimpleFormResultProps<T> {
  inputs: Record<keyof T, IField<T>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearForm: () => void;
}

const validateField = <T>(fieldObj: IField<T>) => {
  const result: Omit<IField<T>, 'field' | 'defaultValue'> = {
    invalid: false,
    error: null,
  };
  const { value } = fieldObj;
  if (fieldObj.required && !value) {
    result.invalid = true;
    result.error = 'required';
  } else if (fieldObj.pattern && typeof value === 'string' && !fieldObj.pattern.test(value)) {
    result.invalid = true;
    result.error = 'pattern';
  }
  return result;
};

const getInitialState = <T>(fields: IField<T>[]) => {
  const initialState = {} as Record<keyof T, IField<T>>;
  fields.forEach(
    (v) =>
      (initialState[v.field] = {
        ...v,
        value: v.defaultValue,
        dirty: false,
        invalid: false,
      }),
  );
  return initialState;
};

export const useSimpleForm = <T>(
  fields: IField<T>[],
  onSubmit: (e: Record<keyof T, IField<T>>) => void,
  onValidationFailed: (e: Record<keyof T, IField<T>>) => void,
): IUseSimpleFormResultProps<T> => {
  const [inputs, setInputs] = useState(() => getInitialState<T>(fields));

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist?.();
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: {
        ...inputs[event.target.name as keyof T],
        dirty: true,
        ...validateField({ ...inputs[event.target.name as keyof T], value }),
        value,
      },
    }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault?.();
      setInputs((inputs) => ({ ...inputs, submitted: true }));
      fields.forEach((v) => {
        Object.assign(
          inputs[v.field],
          validateField(inputs[v.field]),
        );
      });
      const isInvalid = Object.keys(inputs).some((key) => inputs[key as keyof T].invalid);
      if (!isInvalid) {
        onSubmit?.(inputs);
      } else {
        onValidationFailed?.(inputs);
      }
    },
    [inputs, fields, onSubmit, onValidationFailed],
  );

  const clearForm = useCallback(() => {
    setInputs(getInitialState<T>(fields));
  }, [fields]);

  return {
    handleInputChange,
    inputs,
    handleSubmit,
    clearForm,
  };
};