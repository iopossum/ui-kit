import React, { useCallback, useState, useEffect, useRef, useMemo, memo } from 'react';
import { string, number, oneOfType, oneOf, element, node, object, array, func, bool, instanceOf } from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import { useAppStoreMedia } from '@stores';
import cn from 'classnames';
import moment from 'moment';

import './DateRange.scss';

export const DateRange = ({
  className,
  label,
  from,
  to,
  onChange,
  disabledAfter
}) => {

  const toRef = useRef(null);

  const handleFromChange = useCallback((from) => {
    onChange({ from });
  }, [from, to]);

  const handleToChange = useCallback((to) => {
    onChange({ to });
  }, [from, to]);

  const modifiers = { start: from, end: to };

  const { matches } = useAppStoreMedia();
  const numberOfMonths = matches.small ? 1 : 2;

  const disabledDaysFrom = { after: to };
  if (disabledAfter && moment(disabledAfter).isValid()) {
    if (!to || to && moment(disabledAfter).isBefore(moment(to))) {
      disabledDaysFrom.after = disabledAfter;
    }
  }

  return (
    <div className={cn('date-range', {[className]: !!className})}>
      { label ? <span className="date-range__label">{ label }</span> : null }
      <DayPickerInput
        value={from}
        placeholder="с"
        format="LL"
        formatDate={formatDate}
        parseDate={parseDate}
        inputProps={{
          readOnly: 'readonly',
        }}
        dayPickerProps={{
          localeUtils: MomentLocaleUtils,
          locale: 'ru',
          selectedDays: [from, { from, to }],
          disabledDays: disabledDaysFrom,
          toMonth: to,
          modifiers,
          numberOfMonths
          // onDayClick: () => toRef.current.getInput().focus(),
        }}
        onDayChange={handleFromChange}
      />{' '}
      —{' '}
      <span className="date-range__to">
        <DayPickerInput
          ref={toRef}
          value={to}
          placeholder="по"
          format="LL"
          formatDate={formatDate}
          parseDate={parseDate}
          inputProps={{
            readOnly: 'readonly',
          }}
          dayPickerProps={{
            localeUtils: MomentLocaleUtils,
            locale: 'ru',
            selectedDays: [from, { from, to }],
            disabledDays: { before: from, after: disabledAfter },
            modifiers,
            month: from,
            fromMonth: from,
            numberOfMonths
          }}
          onDayChange={handleToChange}
        />
      </span>
    </div>
  );
};

DateRange.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Label */
  label: string,
  /** Date from */
  from: instanceOf(Date),
  /** Date to */
  to: instanceOf(Date),
  /** disableAfter */
  disabledAfter: instanceOf(Date),
  /** onChange callback*/
  onChange: func,
};

DateRange.defaultProps = {
  className: '',
  label: '',
  onChange: () => {}
};
