import { memo } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmationDialog = memo(function ConfirmationDialog({
  title = 'Konfirmasi',
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  isOpen,
  isProcessing = false,
  processingText = 'Memproses...',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {message?.includes('\n') ? (
            <div className="space-y-2">
              {message.split('\n').map((line, i) => (
                <p
                  key={i}
                  className={`text-slate-700 dark:text-slate-300 ${i === 0 ? 'font-medium' : 'text-sm'}`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-slate-700 dark:text-slate-300">{message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="btn-secondary flex-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{processingText}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmationDialog;
