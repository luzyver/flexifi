import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Dialog konfirmasi yang dapat dikustomisasi untuk berbagai tindakan
 */
const ConfirmationDialog = ({ 
  title = "Konfirmasi Tindakan",
  message, 
  confirmText = "Hapus", 
  cancelText = "Batal", 
  onConfirm, 
  onCancel, 
  isOpen,
  isProcessing = false,
  processingText = "Memproses..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-danger-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <button 
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {message && message.includes('\n') ? (
            <div className="text-left">
              {message.split('\n').map((line, index) => (
                <p key={index} className={`${index === 0 ? 'text-lg mb-4' : 'mb-2'} text-gray-700 dark:text-gray-300`}>
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">{message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center space-x-3 p-6 pt-0">
          <button 
            type="button" 
            className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`px-6 py-2 text-white rounded-lg transition-colors font-medium flex items-center ${isProcessing ? 'bg-danger-600/70 cursor-not-allowed' : 'bg-danger-600 hover:bg-danger-700'}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {processingText}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
