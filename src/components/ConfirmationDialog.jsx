import React from 'react';
import { Modal, OutlineButton, PrimaryButton } from './auth';

const ConfirmationDialog = ({ message, onConfirm, onCancel, isOpen }) => {
  return (
    <Modal 
      show={isOpen} 
      onClose={onCancel}
      title={<><i className="bi bi-exclamation-triangle me-1"></i> Konfirmasi</>}
      size="sm"
      centered
      backdrop
      headerClassName="bg-danger text-white"
      closeButtonClassName="btn-close-white"
    >
      <div className="text-center p-2">
        <p className="mb-2 small">{message}</p>
        <div className="d-flex justify-content-center mt-2">
          <OutlineButton
            text="Batal"
            onClick={onCancel}
            variant="secondary"
            className="me-2"
          />
          <PrimaryButton
            text="Hapus"
            icon="bi-trash-fill"
            onClick={onConfirm}
            variant="danger"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
