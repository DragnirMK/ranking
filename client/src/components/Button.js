// components/Button.js
import React from 'react';
import './Button.css';

const Button = ({ text, onClick, className }) => {
  return (
    <button className={`app-btn ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;