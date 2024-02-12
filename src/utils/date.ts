import { addMinutes, subMinutes } from 'date-fns';

export const DATE_FORMAT = 'dd.MM.yyyy';

export const getLocalTimezoneOffset = (date?: string) => {
  return date ? new Date(date).getTimezoneOffset() : new Date().getTimezoneOffset();
};

export const getUTCDate = (date: string | Date) => {
  const offset = getLocalTimezoneOffset();
  return Math.sign(offset) !== -1 ? addMinutes(new Date(date), offset) : subMinutes(new Date(date), Math.abs(offset));
};
