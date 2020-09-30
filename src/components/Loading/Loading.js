import ReactLoaderSpinner from 'react-loader-spinner';
import React from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array, bool } from 'prop-types';

import './Loading.scss';

export const loadingAttrs = {
  type: "BallTriangle",
  height: 100,
  width: 100,
  global: true
};

export const Loading = ({
  className,
  style,
  type,
  color,
  height,
  width,
  global
}) => {
  const attrs = {
    type,
    color,
    height,
    width
  };
  const styleObj = style ? {...style} : {};
  if (global) {
    styleObj.position = 'fixed';
  }
  return (
    <div className={`${className || 'loading'}`} style={styleObj}>
      <ReactLoaderSpinner {...attrs} />
    </div>
  )
};

Loading.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Тип */
  type: string,
  /** Цвет */
  color: string,
  /** Высота */
  height: oneOfType([string, number]),
  /** Ширина */
  width: oneOfType([string, number]),
  /** position: fixed */
  global: bool,
};

Loading.defaultProps = {
  type: "TailSpin",
  color: "#bf4e6a",
  height: 40,
  width: 40,
  global: false
};

export const LoadingContainer = ({
  className,
  style,
  loading,
  children
}) => {
  return (
    <div className={ cn('loading-container', {[className]: !!className }) } style={style}>
      { loading && <Loading /> }
      { children }
    </div>
  )
};

LoadingContainer.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Показывать иконку загрузки */
  loading: bool,
  /** children */
  children: node
};

LoadingContainer.defaultProps = {
  loading: false
};
