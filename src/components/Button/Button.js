import React, { useCallback, useState, createRef, forwardRef, useEffect, useRef, useMemo, useImperativeHandle, memo } from 'react';
import { string, func, number, oneOfType, oneOf, arrayOf, node, object, array, bool, element } from 'prop-types';
import { Button as DevextremeButton } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import cn from 'classnames';

import './Button.scss';

export const Button = ({
  loading,
  text,
  texts,
  type,
  hint,
  className,
  style,
  disabled,
  stylingMode,
  ...props
}) => {
  hint = hint || text;
  let _text = texts.length ? texts[0] : text;
  if (loading && texts.length > 1) {
    _text = texts[1];
  }
  return (
    <DevextremeButton
      stylingMode={stylingMode}
      type={type}
      hint={hint}
      style={style}
      disabled={disabled || loading}
      className={cn('ph-button', {[className]: !!className})}
      {...props}
    >
      <LoadIndicator className="button-indicator" visible={loading} />
      <span className="dx-button-text">{ _text }</span>
    </DevextremeButton>
  );
};

Button.propTypesConstants = {
  type: ['default', 'back', 'danger', 'normal', 'success'],
  stylingMode: ['outlined', 'text', 'contained'],
};

Button.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** loading */
  loading: bool,
  /** text */
  text: string,
  /** texts */
  texts: array,
  /** type */
  type: oneOf(Button.propTypesConstants.type),
  /** hint */
  hint: string,
  /** stylingMode */
  stylingMode: oneOf(Button.propTypesConstants.stylingMode),
  /** disabled */
  disabled: bool,
};

Button.defaultProps = {
  texts: [],
  type: Button.propTypesConstants.type[0],
  stylingMode: Button.propTypesConstants.stylingMode[0],
};
