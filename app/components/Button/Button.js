/** @format */

import React from "react";

const Button = ({
  btnTitle,
  className,
  btnClassName,
  type,
  disabled,
  onClick,
  isLoading,
}) => {
  return (
    <div className={`custom_buttom ${className}`}>
      <button
        type={type}
        disabled={isLoading ? true : disabled}
        onClick={onClick}
        className={`${btnClassName} custom_button_inner ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Loading..." : btnTitle}
      </button>
    </div>
  );
};

export default Button;
