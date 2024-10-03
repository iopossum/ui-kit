import React, { useCallback, useRef, useState, memo, useEffect } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import type { DateRange as DateRangeLibProps, PropsRange } from 'react-day-picker';
import { usePopper } from 'react-popper';

import cn from 'classnames';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Card } from '@components/card';
import { useOutsideClick } from '@hooks/use-outside-click';
import type { IWithStyles } from '@types';
import { DATE_FORMAT } from '@utils/date';
import { MOBILE_MAX_WIDTH } from '@utils/media';

import 'react-day-picker/style.css';
import './date-range.scss';

export interface IDateRangeProps extends DateRangeLibProps, IWithStyles, Omit<PropsRange, 'mode'> {
  label?: string;
  dateFormat?: string;
  onChange: (e: { from?: Date; to?: Date }) => void;
}

export const DateRange = ({
  className,
  style,
  label,
  from,
  to,
  dateFormat = DATE_FORMAT,
  onChange,
  ...rest
}: IDateRangeProps) => {
  const inputFromRef = useRef<HTMLInputElement>(null);

  const [inputFromValue, setInputFromValue] = useState<string>('');
  const [inputToValue, setInputToValue] = useState<string>('');
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const popper = usePopper(inputFromRef.current, popperElement, {
    placement: 'bottom-start',
  });

  useEffect(() => {
    setInputFromValue(from ? format(from, dateFormat as string) : '');
  }, [from, dateFormat]);

  useEffect(() => {
    setInputToValue(to ? format(to, dateFormat as string) : '');
  }, [to, dateFormat]);

  const handleFocus = useCallback(() => {
    setIsPopperOpen(true);
  }, []);

  const handleRangeSelect = useCallback<NonNullable<PropsRange['onSelect']>>(
    (range) => {
      onChange(range || { from: undefined, to: undefined });
    },
    [onChange],
  );

  const handleClickOutside = useCallback(() => {
    setIsPopperOpen(false);
  }, []);

  useOutsideClick<HTMLDivElement>(popperElement, handleClickOutside);

  const numberOfMonths = window.innerWidth <= MOBILE_MAX_WIDTH ? 1 : 2;

  const defaultClassNames = getDefaultClassNames();

  return (
    <div className={cn('date-range', { [className as string]: !!className })} style={style}>
      {!!label && <span className="date-range__label">{label}</span>}
      <input size={10} placeholder="с" value={inputFromValue} onFocus={handleFocus} ref={inputFromRef} readOnly />
      —
      <input size={10} placeholder="по" value={inputToValue} onFocus={handleFocus} readOnly />
      {isPopperOpen ? (
        <div style={popper.styles.popper} {...popper.attributes.popper} ref={setPopperElement} role="dialog">
          <Card>
            <DayPicker
              locale={ru}
              autoFocus={isPopperOpen}
              numberOfMonths={numberOfMonths}
              defaultMonth={from || to || new Date()}
              classNames={defaultClassNames}
              {...rest}
              mode="range"
              selected={{ from, to }}
              onSelect={handleRangeSelect}
            />
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export const DateRangeMemo = memo(DateRange);
