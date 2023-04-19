import { IField } from '@types';

export const getInitialValues = <T extends object>(fields: IField<T>[]) => {
  return fields.reduce<T>((sum, item) => {
    sum[item.field] = item.defaultValue;
    return sum;
  }, {} as T);
};

export const createValidation = <T>(fields: IField<T>[]) => {
  return async (values: T) => {
    const errors = {} as Record<keyof T, string>;
    for (const item of fields) {
      if (item.required && !values[item.field]) {
        errors[item.field] = 'required';
      } else if (
        item.pattern &&
        typeof values[item.field] === 'string' &&
        !item.pattern.test(values[item.field] as string)
      ) {
        errors[item.field] = 'pattern';
      } else if (item.validation) {
        const result = await item.validation({ ...item, value: values[item.field] }, values);
        if (result) {
          errors[item.field] = result;
        }
      }
    }
    return errors;
  };
};
