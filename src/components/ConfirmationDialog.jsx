import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel, isOpen }) => {
  return (
    <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg rounded-3 border-0">
          <div className="modal-header bg-danger text-white rounded-top-3">
            <h5 className="modal-title"><i className="bi bi-exclamation-triangle-fill me-2"></i> Confirm Action</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body p-4 text-center">
            <p className="lead">{message}</p>
          </div>
          <div className="modal-footer justify-content-center border-top-0 pb-4">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              <i className="bi bi-trash-fill me-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;