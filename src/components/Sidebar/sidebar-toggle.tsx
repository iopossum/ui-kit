import React from 'react';

import cn from 'classnames';

import { Button } from '@components/button';
import type { IButtonProps } from '@components/button';

export const SidebarToggle = ({ className, ...rest }: Pick<IButtonProps, 'onClick' | 'className'>) => (
  <div className={cn('sidebar__toggle', { [className as string]: !!className })}>
    <Button icon="menu" {...rest} />
  </div>
);
