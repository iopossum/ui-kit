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
  return <DateRange {...props} from={value.from} to={value.to} onChange={(e) => setValue({ ...value, ...e })} />;
};

const TemplateMemo = (props: IDateRangeProps) => {
  const [value, setValue] = useState<Pick<IDateRangeProps, 'from' | 'to'>>({
    from: new Date(),
    to: undefined,
  });
  return <DateRangeMemo {...props} from={value.from} to={value.to} onChange={(e) => setValue({ ...value, ...e })} />;
};

export const Basic: StoryObj<typeof DateRange> = {
  render: Template,
  args: {}
};

export const Memo: StoryObj<typeof DateRangeMemo> = {
  render: TemplateMemo,
  args: {}
};

export const Disabled: StoryObj<typeof DateRange> = {
  render: Template,
  name: 'Disabled days',
  args: {
    toDate: new Date(),
    disabled: [{ from: new Date() }],
  }
};