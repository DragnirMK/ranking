import React from "react";
import "../styles/InputText.css";

const InputText = ({placeholder, type, onChange, className, onKeyDown, size, disabled, value}) => {
  const inputSizeClass = size === "small" ? "app-input-small" : "";

  return (
    <input
      type={type || "text"}
      className={`app-input ${inputSizeClass} ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled || false}
      value={value}
    />
  );
};

export default InputText;
