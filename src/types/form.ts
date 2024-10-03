import { RegisterOptions } from 'react-hook-form';

export interface IField<T extends object> {
  field: keyof T;
  defaultValue: T[keyof T];
  value?: T[keyof T];
  pattern?: RegExp;
  invalid?: boolean;
  error?: string | null;
  dirty?: boolean;
  skippable?: boolean;
  validation?: (field: IField<T>, values: T) => Promise<string | null>;
  rules?: RegisterOptions<T>;
}
