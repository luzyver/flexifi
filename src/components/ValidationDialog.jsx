import React from 'react';
import './ValidationDialog.css';

const ValidationDialog = ({ message, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button onClick={onClose} className="btn btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationDialog;
