import React from 'react';
import '../styles/Button.css';

const Button = ({ text, onClick, className, disabled }) => {
  return (
    <button className={`app-btn ${className} ${disabled ? 'app-btn-disabled' : ''}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;