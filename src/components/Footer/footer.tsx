import React, { useCallback, memo } from 'react';

import cn from 'classnames';

import type { IWithStyles } from '@types';

import './footer.scss';

export interface IFooterProps extends IWithStyles {
  label?: string;
  yearFrom?: number;
  yearTo?: number;
  children?: React.ReactNode;
  onInitialized?: (e: HTMLDivElement) => void;
}

export const Footer = ({
  className,
  style,
  yearFrom = 2018,
  yearTo = new Date().getFullYear(),
  label = 'Все права защищены, ООО "ФАРМАСОФТ"',
  children,
  onInitialized,
}: IFooterProps) => {
  const ref = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        onInitialized?.(node);
      }
    },
    [onInitialized],
  );
  return (
    <div ref={ref} style={style} className={cn('page-footer', { [className as string]: !!className })}>
      {children}
      <span>
        © {yearFrom}-{yearTo} {label}
      </span>
    </div>
  );
};

export const FooterMemo = memo(Footer);
