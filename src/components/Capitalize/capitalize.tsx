import React, { memo } from 'react';

import cn from 'classnames';

import type { IWithStyles } from '@types';

import './capitalize.scss';

export interface ICapitalizeProps extends IWithStyles {
  text: string;
  exact?: boolean;
}

export const Capitalize = ({ text, exact, className, style }: ICapitalizeProps) => {
  text = text || '';
  const split = text.split(' ');
  return (
    <div className={cn('capitalize', { [className as string]: !!className })} style={style}>
      {exact || text.length <= 2
        ? text
        : `${(split[0] && split[0].charAt(0)) || ''}${(split[1] && split[1].charAt(0)) || ''}`}
    </div>
  );
};

export const CapitalizeMemo = memo(Capitalize);
