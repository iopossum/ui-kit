import { addMinutes, subMinutes, format, FormatDateOptions } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

export const DATE_FORMAT = 'dd.MM.yyyy';

export const getLocalTimezoneOffset = (date?: string) => {
  return date ? new Date(date).getTimezoneOffset() : new Date().getTimezoneOffset();
};

export const getUTCDate = (date: string | Date) => {
  const offset = getLocalTimezoneOffset();
  return Math.sign(offset) !== -1 ? addMinutes(new Date(date), offset) : subMinutes(new Date(date), Math.abs(offset));
};

export const formatDate = (date: string | Date, formatStr?: string, options?: FormatDateOptions) => {
  return format(new Date(date), formatStr || DATE_FORMAT, { locale: ru, ...options });
};
