import React, { memo } from 'react';

import cn from 'classnames';
import { Button as DxButton } from 'devextreme-react/button';
import type { IButtonOptions } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';

import type { IWithStyles } from '@types';

import './button.scss';

export interface IButtonProps extends Omit<IButtonOptions, 'style'>, IWithStyles {
  loading?: boolean;
  allowLoading?: boolean;
  texts?: string[];
}

export const Button = (props: IButtonProps) => {
  const { loading, allowLoading = true, text, texts = [], hint, disabled, className, ...rest } = props;

  let displayText = texts?.length ? texts[0] : text;
  if (loading && texts && texts.length > 1) {
    displayText = texts[1];
  }

  return (
    <DxButton
      hint={hint || text}
      disabled={disabled || loading}
      className={cn('ph-button', {
        [className as string]: !!className,
        icon: !!rest.icon,
      })}
      type="normal"
      stylingMode={'contained'}
      text={text}
      {...rest}
    >
      {!rest.icon && allowLoading ? (
        <>
          <LoadIndicator className="button-indicator" visible={loading} />
          <span className="dx-button-text">{displayText}</span>
        </>
      ) : null}
    </DxButton>
  );
};

export const ButtonMemo = memo(Button);
