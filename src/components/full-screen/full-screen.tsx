import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState, memo } from 'react';

import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined';
import cn from 'classnames';
import screenfull from 'screenfull';

import type { IWithStyles } from '@types';

import './full-screen.scss';

export const Zoom = () => {
  return <FullscreenOutlined />;
};

export interface IFullScreenHandle {
  open: () => void;
}

export interface IFullScreenProps extends IWithStyles {
  children: React.ReactNode;
  enabled?: boolean;
  onChange?: (e: boolean) => void;
}

export const FullScreen = forwardRef<IFullScreenHandle, IFullScreenProps>(
  ({ className, style, enabled, children, onChange }, ref) => {
    const wrapperRef = useRef(null);
    const [isEnabled, setIsEnabled] = useState(enabled);

    const isSupported = !!screenfull.on;

    useImperativeHandle(ref, () => ({
      open: () => setIsEnabled(true),
    }));

    const handleChange = useCallback(
      (value: boolean) => {
        setIsEnabled(value);
        onChange?.(value);
      },
      [onChange],
    );

    const handleClose = () => handleChange(false);

    useEffect(() => {
      if (isSupported) {
        const screenfullChange = () => {
          handleChange(screenfull.isFullscreen);
        };
        screenfull.on('change', screenfullChange);
        return () => {
          screenfull.off('change', screenfullChange);
        };
      }
    }, [handleChange, isSupported]);

    useEffect(() => {
      if (enabled !== isEnabled) {
        setIsEnabled(enabled);
      }
    }, [enabled, isEnabled]);

    useEffect(() => {
      if (isSupported) {
        if (wrapperRef.current && screenfull.isEnabled && isEnabled) {
          screenfull.request(wrapperRef.current);
        }
      } else {
        const screenfullNotSupportedChange = (e: KeyboardEvent) => {
          e = e || window.event;
          if (e.key === 'Escape') {
            handleChange(false);
          }
        };
        if (isEnabled) {
          document.addEventListener('keydown', screenfullNotSupportedChange);
        } else {
          document.removeEventListener('keydown', screenfullNotSupportedChange);
        }
      }
    }, [isEnabled, handleChange, isSupported]);

    return (
      <div
        className={cn('fullscreen', {
          [className as string]: !!className,
          fullscreen_enabled: isEnabled,
          'fullscreen_not-supported': !isSupported,
        })}
        style={style}
        ref={wrapperRef}
      >
        {!isSupported && isEnabled && (
          <div className="fullscreen__close" onClick={handleClose}>
            ×
          </div>
        )}
        {children}
      </div>
    );
  },
);

export const FullScreenMemo = memo(FullScreen);
