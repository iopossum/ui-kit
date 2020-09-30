import React, { useCallback, useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { Card } from "@components/Card";
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf, element } from 'prop-types';
import cn from 'classnames';

import './AuthWrapper.scss';

export const AuthWrapper = ({
  className,
  style,
  onSubmit,
  header,
  children
}) => {
  return (
    <Container component="main" maxWidth="xs" className={cn('auth-wrapper', {[className]: !!className})} style={style}>
      <Card header={header} className="card_flex1">
        <form className="auth-wrapper__form" noValidate onSubmit={onSubmit}>
          { children }
        </form>
      </Card>
    </Container>
  )
};

AuthWrapper.propTypes = {
  /** Кастомный класс */
  className: string,
  /** Кастомный стиль */
  style: oneOfType([object, array]),
  /** Название формы */
  header: string,
  /** onSubmit callback */
  onSubmit: func.isRequired,
  /** children */
  children: node.isRequired
};

AuthWrapper.defaultProps = {

};
