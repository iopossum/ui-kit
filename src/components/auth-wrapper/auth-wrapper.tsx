import React, { memo, CSSProperties } from 'react';

import cn from 'classnames';

import { Card } from '@components/card';
import type { ReactNode, IWithStyles } from '@types';

import './auth-wrapper.scss';

export interface IAuthWrapperProps extends IWithStyles {
  children: React.ReactNode;
  header?: ReactNode;
}

const CUSTOM_STYLE: CSSProperties = { margin: '0 auto' };

export const AuthWrapper: React.FC<IAuthWrapperProps> = ({ className, style, header, children }) => {
  return (
    <div
      className={cn('auth-wrapper', { [className as string]: !!className })}
      style={Object.assign(CUSTOM_STYLE, style)}
    >
      <Card header={header} className="card_flex1">
        <div className="auth-wrapper__form">{children}</div>
      </Card>
    </div>
  );
};

export const AuthWrapperMemo = memo(AuthWrapper);
