
import React, { memo } from 'react';

import { Tooltip as AntdTooltip } from 'antd';
import type { TooltipProps } from 'antd';

export interface ITooltipProps extends Omit<TooltipProps, 'children'> {
  children: React.ReactElement;
  disabled?: boolean;  
}

export const Tooltip = ({ disabled, ...rest }: ITooltipProps) => {
  return !disabled ? <AntdTooltip {...rest} /> : rest.children;
};

export const TooltipMemo = memo(Tooltip);