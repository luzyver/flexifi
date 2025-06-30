import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
