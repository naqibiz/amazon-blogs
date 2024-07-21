/** @format */

import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";

const InputFormControl = forwardRef(function InputFormControl(
  {
    placeholder,
    required,
    type,
    as,
    name,
    rows,
    inputMode,
    value,
    onChange,
    disabled,
    maxlength,
    readOnly,
    className,
    label,
  },
  ref
) {
  return (
    <Form.Group className={`input-form-group`}>
      <Form.Label className={`input-label`}>{label}</Form.Label>
      <Form.Control
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        type={type}
        as={as}
        name={name}
        rows={rows}
        inputMode={inputMode}
        ref={ref}
        disabled={disabled}
        value={value}
        maxlength={maxlength}
        onChange={onChange}
        className={`${className} input-form-control`}
      />
    </Form.Group>
  );
});

export default InputFormControl;
