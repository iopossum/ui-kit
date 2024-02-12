import { add } from 'date-fns';
import type { LoadOptions } from 'devextreme/data';
import type { SelectedFilterOperation } from 'devextreme/ui/data_grid';
import type { IColumnProps } from 'devextreme-react/data-grid';

export interface IFullName {
  lastName: string;
  firstName: string;
  middleName?: string;
}

export interface IRequestQueryProps {
  limit?: number;
  skip?: number;
  order?: string | string[];
  where: Record<string, unknown>;
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

export const convertDataGridCondition = (value: string, condition: SelectedFilterOperation) => {
  switch (condition) {
    case '=':
      return { eq: value };
      break;
    case '<>':
      return { neq: value };
      break;
    case '<':
      return { lt: value };
      break;
    case '>':
      return { gt: value };
      break;
    case '<=':
      return { lte: value };
      break;
    case '>=':
      return { gte: value };
      break;
    case 'contains':
      return { regexp: new RegExp(value, 'i').toString() };
      break;
    case 'notcontains':
      return { nlike: new RegExp(value, 'i').toString() };
      break;
    case 'startswith':
      return { regexp: new RegExp(`^${value}`, 'i').toString() };
      break;
    case 'endswith':
      return { regexp: new RegExp(`${value}$`, 'i').toString() };
      break;
  }
};

const getGroupConds = (group: unknown, conds: unknown[], prevCond?: unknown) => {
  if (Array.isArray(group) && typeof group[1] === 'string') {
    if (Array.isArray(group[0])) {
      if (prevCond === group[1]) {
        group.forEach((item, i) => {
          getGroupConds(item, conds);
        });
      } else {
        const result = {
          [group[1]]: [],
        };
        group.forEach((item, i) => {
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

export const convertDataGridOptions = (
  opts: LoadOptions & { isLoadingAll?: boolean },
  props: Record<string, unknown>,
) => {
  const { take, skip, isLoadingAll, searchValue, searchExpr, filter, userData, sort } = opts;
  const query: IRequestQueryProps = {
    limit: take || 20,
    skip: skip || 0,
    where: { and: [] },
  };
  if (isLoadingAll) {
    delete query.limit;
    delete query.skip;
  }
  try {
    if (searchValue && searchExpr) {
      (query.where.and as Array<Record<string, unknown>>).push({
        [searchExpr as string]: {
          regexp: new RegExp(searchValue, 'i').toString(),
        },
      });
    }
    if (filter && filter.length) {
      getGroupConds(filter, query.where.and as Array<Record<string, unknown>>, 'and');
    }
  } catch (e) {}
  if (userData && Object.keys(userData).length) {
    if (userData.and) {
      if (userData.and.length) {
        query.where.and = query.where.and || [];
        query.where.and = (query.where.and as Array<Record<string, unknown>>).concat(userData.and.slice());
      }
    } else {
      query.where.and = query.where.and || [];
      query.where.and = (query.where.and as Array<Record<string, unknown>>).concat(
        Object.keys(userData).map((key) => ({ [key]: userData[key] })),
      );
    }
  }
  if (props && Object.keys(props).length) {
    if (props.and) {
      if (Array.isArray(props.and) && props.and.length) {
        query.where.and = query.where.and || [];
        query.where.and = (query.where.and as Array<Record<string, unknown>>).concat(props.and.slice());
      }
    } else {
      query.where.and = query.where.and || [];
      query.where.and = (query.where.and as Array<Record<string, unknown>>).concat(
        Object.keys(props).map((key) => ({ [key]: props[key] })),
      );
    }
  }
  if (sort && Array.isArray(sort)) {
    query.order = sort.map((v: unknown) =>
      typeof v === 'string' ? v : `${(v as IOrder).selector} ${(v as IOrder).desc ? 'DESC' : 'ASC'}`,
    );
  }
  if ((query.where.and as Array<Record<string, unknown>>).length <= 1) {
    const cond = (query.where.and as Array<Record<string, unknown>>)[0] || {};
    Object.assign(query.where, cond);
    delete query.where.and;
  }
  return query;
};

export const calculateDateFilterExpression = function (
  this: IColumnProps,
  value: Date,
  selectedFilterOperations: SelectedFilterOperation,
) {
  const timezoneOffsett = value.getTimezoneOffset();
  const adjustedDate = new Date(value.getTime() - timezoneOffsett * 60000);
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
