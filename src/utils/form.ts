import { FieldValues } from 'react-hook-form';

import { keyBy, reduce } from 'lodash-es';

import { IField } from '@types';

export const getInitialValues = <T extends object>(fields: IField<T>[]) => {
  return fields.reduce<T>((sum, item) => {
    sum[item.field] = item.defaultValue;
    return sum;
  }, {} as T);
};

export const getFormValues = <T>(inputs: Record<keyof T, IField<T>>) => {
  return reduce(
    inputs,
    (result, value, key) => {
      if (!value.skippable) {
        result[key as keyof T] = value.value;
      }
      return result;
    },
    {} as Record<keyof T, T[keyof T] | undefined>,
  );
};

export const getChangedFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean>>,
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce((acc, currentField) => {
    return {
      ...acc,
      [currentField]: allFields[currentField],
    };
  }, {} as Partial<T>);

  return changedFieldValues;
};

export const getFieldsMap = <T>(fields: IField<T>[]) => keyBy(fields, 'field') as Record<keyof T, IField<T>>;
