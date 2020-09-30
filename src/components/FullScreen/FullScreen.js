import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import { string, number, oneOfType, oneOf, element, node, object, array, func, bool, instanceOf } from 'prop-types';
import screenfull from 'screenfull';
import cn from 'classnames';
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';

import './FullScreen.scss';

export const Zoom = () => {
  return (
    <ZoomOutMapSharpIcon fontSize="small"/>
  );
};

export const FullScreen = forwardRef(({
  className,
  style,
  enabled,
  onChange,
  children
}, ref) => {

  const wrapperRef = useRef(null);
  const [_enabled, _setEnabled] = useState(enabled);

  const isSupported = useRef(!!screenfull.on);

  useEffect(() => {
    if (enabled !== _enabled) {
      _setEnabled(enabled);
    }
  }, [enabled]);

  useImperativeHandle(ref, () => ({
    open: () => _setEnabled(true)
  }));

  const _onChange = useCallback((value) => {
    _setEnabled(value);
    onChange && onChange(value);
  }, []);

  const screenfullChange = useCallback(() => {
    _onChange(screenfull.isFullscreen);
  }, []);

  const screenfullNotSupportedChange = useCallback((e) => {
    e = e || window.event;
    if (e.keyCode == 27) {
      _onChange(false);
    }
  }, []);

  useEffect(() => {
    if (isSupported.current) {
      screenfull.on('change', screenfullChange);
      return () => {
        screenfull.off('change', screenfullChange);
      };
    }
  }, []);

  useEffect(() => {
    if (isSupported.current) {
      if (wrapperRef.current && screenfull.isEnabled && _enabled) {
        screenfull.request(wrapperRef.current);
      }
    } else {
      if (_enabled) {
        document.addEventListener('keydown', screenfullNotSupportedChange);
      } else {
        document.removeEventListener('keydown', screenfullNotSupportedChange);
      }
    }
  }, [_enabled]);

  return (
    <div
      className={cn("fullscreen", {[className]: !!className, "fullscreen_enabled": _enabled, 'fullscreen_not-supported': !isSupported.current})}
      style={style}
      ref={wrapperRef}
    >
      { !isSupported.current && _enabled && <div className="fullscreen__close" onClick={() => _onChange(false)}>×</div> }
      { children }
    </div>
  );
});

FullScreen.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Enabled */
  enabled: bool,
  /** children */
  children: node,
  /** onChange callback*/
  onChange: func,
};

FullScreen.defaultProps = {
  className: '',
  enabled: false
};
