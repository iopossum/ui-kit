import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DateRange, DateRangeMemo, IDateRangeProps } from '@components/date-range';

export default {
  title: 'DateRange',
  component: DateRange,
} as ComponentMeta<typeof DateRange>;

const Template: ComponentStory<typeof DateRange> = (args) => {
  const [value, setValue] = useState<Pick<IDateRangeProps, 'from' | 'to'>>({
    from: new Date(),
    to: undefined,
  });
  return <DateRange {...args} from={value.from} to={value.to} onChange={(e) => setValue({ ...value, ...e })} />;
};

const TemplateMemo: ComponentStory<typeof DateRangeMemo> = (args) => {
  const [value, setValue] = useState<Pick<IDateRangeProps, 'from' | 'to'>>({
    from: new Date(),
    to: undefined,
  });
  return <DateRangeMemo {...args} from={value.from} to={value.to} onChange={(e) => setValue({ ...value, ...e })} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Memo = TemplateMemo.bind({});
Memo.args = {};

export const Disabled = Template.bind({});
Disabled.storyName = 'Disabled days';
Disabled.args = {
  toDate: new Date(),
  disabled: [{ from: new Date() }],
};
