import React, { memo } from 'react';

import cn from 'classnames';

import type { IWithStyles } from '@types';

export interface ICardContainerProps extends IWithStyles {
  children?: React.ReactNode;
  direction?: 'row' | 'column';
}

export const CardContainer = ({ className, style, direction = 'column', children }: ICardContainerProps) => {
  return (
    <div
      style={style}
      className={cn('card__container', `card__container_${direction}`, {
        [className as string]: !!className,
      })}
    >
      {children || <div />}
    </div>
  );
};

export const CardContainerMemo = memo(CardContainer);
