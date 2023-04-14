import React, { useMemo, memo, ReactNode } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import cn from 'classnames';

import type { IWithStyles } from '@types';

export interface IBackLinkProps extends IWithStyles {
  linkTitle?: string;
  children?: ReactNode;
  backUrl?: string;
}

export const BackLink = ({ className, style, linkTitle, backUrl, children }: IBackLinkProps) => {
  const { path } = useRouteMatch();
  const backUrlMemo = useMemo(() => {
    return backUrl || path.replace('/:id', '');
  }, [backUrl, path]);
  return (
    <div style={style} className={cn('back-link', { [className as string]: !!className })}>
      {children || <div />}
      <Link className="link" to={backUrlMemo}>
        {linkTitle}
      </Link>
    </div>
  );
};

BackLink.defaultProps = {
  linkTitle: 'вернуться к списку',
};

export const BackLinkMemo = memo(BackLink);
