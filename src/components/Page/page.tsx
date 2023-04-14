import React, { memo } from 'react';

import cn from 'classnames';

import type { IWithStyles } from '@types';

import './page.scss';

export interface IPageProps extends IWithStyles {
  children?: React.ReactNode;
}

export const Page = ({ className, style, children }: IPageProps) => {
  return (
    <div style={style} className={cn('page', { [className as string]: !!className })}>
      {children}
    </div>
  );
};

export const PageMemo = memo(Page);
