import { useState, useCallback } from 'react';

/**
 * Custom hook for confirmation dialogs
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const openDialog = useCallback((item, onSuccess = null) => {
    setItemToDelete(item);
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setItemToDelete(null);
    setOnSuccessCallback(null);
  }, []);

  const handleConfirm = useCallback(async (deleteAction) => {
    if (!itemToDelete) return;
    
    setIsProcessing(true);
    try {
      const success = await deleteAction(itemToDelete._id);
      if (success && onSuccessCallback) {
        onSuccessCallback();
      }
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  }, [itemToDelete, onSuccessCallback, closeDialog]);

  return {
    isOpen,
    isProcessing,
    itemToDelete,
    openDialog,
    closeDialog,
    handleConfirm,
  };
}
