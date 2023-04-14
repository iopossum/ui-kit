import React, { memo } from 'react';

import cn from 'classnames';

import type { ReactNode, IWithStyles } from '@types';

import './card.scss';

export interface ICardProps extends IWithStyles {
  children?: React.ReactNode;
  header?: ReactNode;
}

export const Card = ({ className, style, header, children }: ICardProps) => {
  return (
    <div style={style} className={cn('card', { [className as string]: !!className })}>
      {!!header && <div className="card__header">{typeof header === 'function' ? header() : header}</div>}
      <div className="card__body">{children}</div>
    </div>
  );
};

export const CardMemo = memo(Card);
