import React from 'react';

import cn from 'classnames';

import { Capitalize } from '@components/capitalize';
import { Tooltip } from '@components/tooltip';
import type { IWithStyles, IRoute } from '@types';

export interface ISidebarLinkProps extends IWithStyles {
  allowTooltip: boolean;
  data: IRoute;
}

export const SidebarLink = ({ data, allowTooltip, style, className }: ISidebarLinkProps) => {
  return (
    <Tooltip            
      placement="right"
      disabled={!allowTooltip}
      title={data.title}
      style={style}      
    >
      <div className={cn(['navigation-item', className])} onClick={data.onClick}>
        { data.icon || data.iconComponent ? (
          <i className={cn(`dx-icon`, {[data.icon as string]: !!data.icon, 'dx-icon-component': !!data.iconComponent})}>{data.iconComponent}</i>
        ) : (
          <Capitalize className="navigation-item__capitalize" text={data.title as string} />
        )}      
        <span className="navigation-item__text">{data.title}</span>      
      </div>
    </Tooltip>
  );
};