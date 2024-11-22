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
    onKeyDown,
    value,
    onChange,
    disabled,
    maxLength,
    readOnly,
    className,
    label,
    icon,
    onClickIcon,
  },
  ref
) {
  return (
    <Form.Group className={`input-form-group`}>
      {label && <Form.Label className={`input-label`}>{label}</Form.Label>}
      <div className="input-form-group-inner">
        <Form.Control
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          type={type}
          as={as}
          name={name}
          rows={rows}
          inputMode={inputMode}
          onKeyDown={onKeyDown}
          ref={ref}
          disabled={disabled}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          className={`${className} input-form-control`}
        />
        {icon && (
          <div className="input_icon" onClick={onClickIcon}>
            {icon}
          </div>
        )}
      </div>
    </Form.Group>
  );
});

export default InputFormControl;
