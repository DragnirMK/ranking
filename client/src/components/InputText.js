import React from "react";
import "../styles/InputText.css";

const InputText = ({placeholder, type, onChange, className, onKeyDown, size}) => {
  const inputSizeClass = size === "small" ? "app-input-small" : "";

  return (
    <input
      type={type || "text"}
      className={`app-input ${inputSizeClass} ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default InputText;
