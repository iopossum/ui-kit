import React, { useMemo, memo, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import cn from 'classnames';

import type { IWithStyles } from '@types';

export interface IBackLinkProps extends IWithStyles {
  linkTitle?: string;
  children?: ReactNode;
  backUrl?: string;
}

export const BackLink = ({ className, style, linkTitle = 'вернуться к списку', backUrl, children }: IBackLinkProps) => {
  const { pathname } = useLocation();
  const backUrlMemo = useMemo(() => {
    return backUrl || pathname.replace(/\/([^/]*)$/, '');
  }, [backUrl, pathname]);
  return (
    <div style={style} className={cn('back-link', { [className as string]: !!className })}>
      {children || <div />}
      <Link className="link" to={backUrlMemo}>
        {linkTitle}
      </Link>
    </div>
  );
};

export const BackLinkMemo = memo(BackLink);
