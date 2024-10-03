import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { DateRange, DateRangeMemo, IDateRangeProps } from '@components/date-range';

export default {
  title: 'DateRange',
  component: DateRange,
} as Meta<typeof DateRange>;

const Template = (props: IDateRangeProps) => {
  const [value, setValue] = useState<Pick<IDateRangeProps, 'from' | 'to'>>({
    from: new Date(),
    to: undefined,
  });
  const handleChange: IDateRangeProps['onChange'] = (e) => setValue({ ...value, ...e });
  return <DateRange {...props} from={value.from} to={value.to} onChange={handleChange} />;
};

const TemplateMemo = (props: IDateRangeProps) => {
  const [value, setValue] = useState<Pick<IDateRangeProps, 'from' | 'to'>>({
    from: new Date(),
    to: undefined,
  });
  const handleChange: IDateRangeProps['onChange'] = (e) => setValue({ ...value, ...e });
  return <DateRangeMemo {...props} from={value.from} to={value.to} onChange={handleChange} />;
};

export const Basic: StoryObj<typeof DateRange> = {
  render: Template,
  args: {},
};

export const Memo: StoryObj<typeof DateRangeMemo> = {
  render: TemplateMemo,
  args: {},
};
