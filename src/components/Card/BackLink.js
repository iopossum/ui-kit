import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { string, number, oneOfType, arrayOf, node, object, array, element } from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

export const BackLink = ({
  className,
  style,
  linkTitle,
  backUrl,
  children
}) => {
  const match = useRouteMatch();
  const _backUrl = useMemo(() => {
    return backUrl || match.path.replace('/:id', '');
  }, [backUrl]);
  return (
    <div style={style} className={cn('back-link', {[className]: !!className})}>
      { children || <div /> }
      <Link className="link" to={_backUrl}>{ linkTitle }</Link>
    </div>
  );
};

BackLink.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** backUrl */
  backUrl: string,
  /** linkTitle */
  linkTitle: string,
  /** children */
  children: node
};

BackLink.defaultProps = {
  linkTitle: 'вернуться к списку'
};
