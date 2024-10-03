import React from 'react';

import cn from 'classnames';

import { Capitalize } from '@components/capitalize';
import { Tooltip } from '@components/tooltip';
import type { IWithStyles, IRoute } from '@types';

export interface ISidebarLinkProps extends IWithStyles {
  allowTooltip: boolean;
  data: Omit<IRoute, 'path'>;
}

export const SidebarLink = ({ data, allowTooltip, style, className }: ISidebarLinkProps) => {
  const { title, icon, iconComponent, onClick: handleClick } = data;
  return (
    <Tooltip placement="right" disabled={!allowTooltip} title={title} style={style}>
      <div className={cn(['navigation-item', className])} onClick={handleClick}>
        {icon || iconComponent ? (
          <i
            className={cn(`dx-icon`, {
              [icon as string]: !!icon,
              'dx-icon-component': !!iconComponent,
            })}
          >
            {iconComponent}
          </i>
        ) : (
          <Capitalize className="navigation-item__capitalize" text={title as string} />
        )}
        <span className="navigation-item__text">{title}</span>
      </div>
    </Tooltip>
  );
};
