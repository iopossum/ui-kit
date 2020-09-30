import moment from 'moment';
import { reduce } from 'lodash-es';

export const formatDate = (date, format) => {
  if (!date) {
    return date;
  }
  return moment(date).format(format);
};

export const convertDataGridCondition = (value, condition) => {
  switch (condition) {
    case '=':
      return {'eq': value};
      break;
    case '<>':
      return {'neq': value};
      break;
    case '<':
      return {'lt': value};
      break;
    case '>':
      return {'gt': value};
      break;
    case '<=':
      return {'lte': value};
      break;
    case '>=':
      return {'gte': value};
      break;
    case 'contains':
      return {'regexp': new RegExp(value, "i").toString()};
      break;
    case 'notcontains':
      return {'nlike': new RegExp(value, "i").toString()};
      break;
    case 'startswith':
      return {'regexp': new RegExp(`^${value}`, 'i').toString()};
      break;
    case 'endswith':
      return {'regexp': new RegExp(`${value}$`, 'i').toString()};
      break;
  }
};

export const convertDataGridOptions = (opts, props) => {
  const query = {
    limit: opts.take || 20,
    offset: opts.skip || 0,
    where: {}
  };
  if (opts.isLoadingAll) {
    delete query.limit;
    delete query.offset;
  }
  if (opts.sort && opts.sort.length) {
    query.sort = {
      field: opts.sort[0].selector,
      desc: opts.sort[0].desc
    };
  }
  try {
    if (opts.searchValue) {
      query.where = {
        [opts.searchExpr]: {regexp: new RegExp(opts.searchValue, 'i').toString()}
      }
    } else if (opts.filter && opts.filter.length) {
      console.log(opts.filter)
      if (Array.isArray(opts.filter[0])) {
        opts.filter.forEach((item, i) => {
          if (Array.isArray(item)) {
            // query.filter.push({key: item[0], common, condition: this.convertDataGridCondition(item[1]), value: item[2]});
            query.where[item[0]] = convertDataGridCondition(item[2], item[1]);
          }
        });
      } else {
        query.where[opts.filter[0]] = convertDataGridCondition(opts.filter[2], opts.filter[1]);
      }
    }
  } catch(e) {
    console.log(e);
  }
  if (props) {
    query.where = query.where || {};
    Object.assign(query.where, props);
  }
  if (opts.sort) {
    query.order = opts.sort.map(v => `${v.selector} ${v.desc ? 'DESC' : 'ASC'}`);
  }
  return query;
};

export const getFormValues = (inputs) => {
  return reduce(inputs, (result, value, key) => {
    result[key] = value.value;
    return result;
  }, {});
};

export const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
