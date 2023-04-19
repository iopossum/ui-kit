import React, { memo } from 'react';

import cn from 'classnames';

import type { IWithStyles } from '@types';

import './header.scss';

export interface IHeaderProps extends IWithStyles {
  children?: React.ReactNode;
}

export const Header = ({ className, style, children }: IHeaderProps) => {
  return (
    <div
      style={style}
      className={cn('header', {
        [className as string]: !!className,
        'header_no-children': !children,
      })}
    >
      {children}
    </div>
  );
};

export const HeaderMemo = memo(Header);
