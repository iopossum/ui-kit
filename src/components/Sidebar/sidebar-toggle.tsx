import React from 'react';

import cn from 'classnames';

import { Button } from '@components/button';
import type { IButtonProps } from '@components/button';

export const SidebarToggle = ({ onClick, className }: Pick<IButtonProps, 'onClick' | 'className'>) => (
  <div className={cn('sidebar__toggle', { [className as string]: !!className })}>
    <Button icon="menu" onClick={onClick} />
  </div>
);
