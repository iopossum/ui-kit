import { add } from 'date-fns';
import type { SelectedFilterOperation } from 'devextreme/ui/data_grid';
import type { IColumnProps } from 'devextreme-react/data-grid';

import { ILoadOptions, ILoopbackFilter, TAndOr } from '@types';
import { getUTCDate } from '@utils/date';

export interface IFullName {
  lastName: string;
  firstName: string;
  middleName?: string;
}

interface IOrder {
  selector: string;
  desc: string;
}

export const prettyNumber = (num?: number | string) => {
  if (!num) {
    return num;
  }
  const floatValue = parseFloat(num as string);
  if (!isNaN(floatValue) && floatValue < 1000) {
    return num;
  }
  return String(num).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

export const toFixed = (value: number, digits: number) => {
  value = value || 0;
  const fixedValue = value ? value.toFixed(digits) : '0';
  return parseFloat(fixedValue);
};

export const getPercentDigits = (value: number) => {
  let digits = 0;
  if (value) {
    if (value < 10) {
      digits = 2;
    } else if (value < 100) {
      digits = 1;
    }
  }
  return digits;
};

export const prettyNumberFixed = (value?: number, digits?: number) => {
  let result: string | undefined;
  if (typeof value !== 'undefined') {
    result = value?.toFixed(digits);
    if (digits! > 0) {
      result = result.replace(/\.0+$/, '');
    }
  }
  return prettyNumber(result);
};

export const prettyNumberFixedPercent = (value?: number, digits?: number) =>
  value && prettyNumberFixed(value, digits || getPercentDigits(value));

export const pluralize = (num: number, array: string[]) => {
  num = toFixed(num, 0);
  let n = Math.abs(num);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return array[2];
  }
  n %= 10;
  if (n === 1) {
    return array[0];
  }
  if (n >= 2 && n <= 4) {
    return array[1];
  }
  return array[2];
};

export const getAgePostfix = (age: number) => {
  return pluralize(age, ['год', 'года', 'лет']);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getFullName = (v: IFullName) => {
  if (!v) {
    return '';
  }
  return `${v.lastName || ''} ${v.firstName || ''} ${v.middleName || ''}`.trim();
};

export const isInt = (value: number | string) => {
  return (
    !isNaN(value as number) &&
    parseInt(Number(value) as unknown as string) === value &&
    !isNaN(parseInt(value as unknown as string, 10))
  );
};

export function convertToInt(v?: string) {
  if (!v) {
    return undefined;
  }
  const intValue = parseInt(v, 10);
  return isNaN(intValue) ? undefined : intValue;
}

export const convertDataGridCondition = (value: string, condition: SelectedFilterOperation) => {
  switch (condition) {
    case '=':
      return { eq: value };
    case '<>':
      return { neq: value };
    case '<':
      return { lt: value };
    case '>':
      return { gt: value };
    case '<=':
      return { lte: value };
    case '>=':
      return { gte: value };
    case 'contains':
      return { regexp: new RegExp(value, 'i').toString() };
    case 'notcontains':
      return { nlike: new RegExp(value, 'i').toString() };
    case 'startswith':
      return { regexp: new RegExp(`^${value}`, 'i').toString() };
    case 'endswith':
      return { regexp: new RegExp(`${value}$`, 'i').toString() };
  }
};

const getGroupConds = <T = {}>(group: unknown, conds: TAndOr<T>[], prevCond?: string) => {
  if (Array.isArray(group) && typeof group[1] === 'string') {
    if (Array.isArray(group[0])) {
      if (prevCond === group[1]) {
        group.forEach((item) => {
          getGroupConds(item, conds);
        });
      } else {
        const result = {
          [group[1]]: [],
        };
        group.forEach((item) => {
          getGroupConds(item, result[group[1]], group[1]);
        });
        conds.push(result);
      }
    } else {
      const value = convertDataGridCondition(group[2], group[1] as SelectedFilterOperation);
      conds.push({ [group[0]]: value });
    }
  }
};

export const convertDataGridOptions = <T = {}>(
  opts: ILoadOptions<T> & { isLoadingAll?: boolean },
  props?: ILoopbackFilter<T>['where'],
) => {
  const { take, skip, isLoadingAll, searchValue, searchExpr, filter, userData, sort } = opts;
  const query: ILoopbackFilter<T> = {
    limit: take || 20,
    skip: skip || 0,
    where: {},
  };
  if (isLoadingAll) {
    delete query.limit;
    delete query.skip;
  }
  let and: TAndOr<T>[] = [];
  try {
    if (searchValue && searchExpr) {
      and.push({
        [searchExpr as string]: {
          regexp: new RegExp(searchValue, 'i').toString(),
        },
      });
    }
    if (filter && filter.length) {
      getGroupConds(filter, and, 'and');
    }
  } catch (e) {}
  if (userData && Object.keys(userData).length) {
    if (userData.and?.length) {
      and = and.concat(userData.and.slice());
    } else {
      and = and.concat(Object.keys(userData).map((key) => ({ [key]: userData[key as keyof typeof userData] })));
    }
  }
  if (props && Object.keys(props).length) {
    if (props.and && Array.isArray(props.and) && props.and.length) {
      and = and.concat(props.and.slice());
    } else {
      and = and.concat(Object.keys(props).map((key) => ({ [key]: props[key as keyof typeof props] })));
    }
  }
  if (sort && Array.isArray(sort)) {
    query.order = sort.map((v: unknown) =>
      typeof v === 'string' ? v : `${(v as IOrder).selector} ${(v as IOrder).desc ? 'DESC' : 'ASC'}`,
    );
  }
  if (and.length) {
    if (and.length === 1) {
      query.where = and[0] as ILoopbackFilter<T>['where'];
    } else {
      query.where = { and } as ILoopbackFilter<T>['where'];
    }
  }
  return query;
};

export const calculateDateFilterExpression = function (
  this: IColumnProps,
  value: Date,
  selectedFilterOperations: SelectedFilterOperation,
) {
  const adjustedDate = getUTCDate(value);
  if (selectedFilterOperations === '=') {
    return [[this.dataField, '>=', adjustedDate], 'and', [this.dataField, '<', add(adjustedDate, { days: 1 })]];
  } else {
    return [this.dataField, selectedFilterOperations, adjustedDate];
  }
};

export const replaceFilterExpression = function (
  this: IColumnProps & { dataFieldOriginal: string },
  value: unknown,
  selectedFilterOperations: SelectedFilterOperation,
) {
  return [this.dataFieldOriginal, selectedFilterOperations, value];
};
