/** @format */

import React from "react";
import Loader from "./Loader";

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
        {isLoading ? <Loader /> : btnTitle}
      </button>
    </div>
  );
};

export default Button;
