import React from 'react';
import './InputText.css';

const InputText = ({ placeholder, type, onChange, className }) => {
  return (
    <input
      type={type || 'text'}
      className={`app-input ${className}`}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default InputText;