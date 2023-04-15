import React from 'react';
import '../styles/PinCode.css';
import Button from './Button';

const PinCode = ({ pinCode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(pinCode);
  };

  return (
    <div className="pincode-container">
      <div className="pincode-text">PIN: {pinCode}</div>
      <Button
        text="Copy"
        onClick={handleCopy}
        className="app-btn-copy"
      />
    </div>
  );
};

export default PinCode;
