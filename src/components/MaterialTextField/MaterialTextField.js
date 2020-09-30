import React from 'react';
import TextField from '@material-ui/core/TextField';
import { string, func, number, oneOfType, arrayOf, node, object, array, bool, oneOf } from 'prop-types';

import './MaterialTextField.scss';

export const MaterialTextField = ({
  type,
  name,
  label,
  required,
  fullWidth,
  hasError,
  value,
  autoComplete,
  autoFocus,
  onChange
}) => {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      type={type}
      error={hasError}
      required={required}
      fullWidth={fullWidth}
      id={name}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
    />
  )
};

MaterialTextField.propTypes = {
  /** Input name */
  name: string.isRequired,
  /** Input type */
  type: string,
  /** Label */
  label: string,
  /** Input required */
  required: bool,
  /** Input fullWidth */
  fullWidth: bool,
  /** Ошибка валидации */
  hasError: bool,
  /** Значение */
  value: oneOfType([string, number]).isRequired,
  /** browser autoComplete */
  autoComplete: string,
  /** autoFocus */
  autoFocus: bool,
  /** onChange callback */
  onChange: func.isRequired,
};

MaterialTextField.defaultProps = {
  type: 'text',
  required: false,
  fullWidth: true,
  hasError: false,
  label: '',
  value: '',
  autoComplete: undefined,
  autoFocus: true,
  onChange: () => {}
};
