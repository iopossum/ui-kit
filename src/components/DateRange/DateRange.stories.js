import React, { useState } from 'react';
import { DateRange } from './index';
import { withKnobs, text, object, number, boolean } from "@storybook/addon-knobs";
import { withInfo, withStores } from '../../../.storybook/decorators';
import { MediaWrapper } from '../MediaWrapper';
import moment from 'moment';

export default {
  title: 'DateRange',
  component: DateRange,
  decorators: [
    withKnobs,
    withInfo(),
    withStores
  ]
};

export const Компонент = () => {
  const [value, setValue] = useState({
    from: null,
    to: null
  });
  return (
    <MediaWrapper>
      <DateRange
        from={value.from}
        to={value.to}
        label={text("label", "")}
        onChange={(e) => setValue({...value, ...e})}
      />
    </MediaWrapper>
  );
};

export const DisabledAfter = () => {
  const [value, setValue] = useState({
    from: null,
    to: null
  });
  return (
    <MediaWrapper>
      <DateRange
        from={value.from}
        to={value.to}
        disabledAfter={moment().startOf('day').add(-1, 'days').toDate()}
        label={text("label", "")}
        onChange={(e) => setValue({...value, ...e})}
      />
    </MediaWrapper>
  );
};


