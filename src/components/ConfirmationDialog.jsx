/**
 * Dialog konfirmasi yang dapat dikustomisasi untuk berbagai tindakan
 * @param {Object} props - Props komponen
 * @param {string} props.title - Judul dialog
 * @param {string} props.message - Pesan konfirmasi
 * @param {string} props.confirmText - Teks tombol konfirmasi
 * @param {string} props.cancelText - Teks tombol batal
 * @param {string} props.confirmIcon - Kelas ikon Bootstrap untuk tombol konfirmasi
 * @param {string} props.confirmButtonClass - Kelas tombol Bootstrap untuk tombol konfirmasi
 * @param {string} props.headerClass - Kelas untuk header dialog
 * @param {Function} props.onConfirm - Fungsi yang dipanggil saat pengguna mengkonfirmasi
 * @param {Function} props.onCancel - Fungsi yang dipanggil saat pengguna membatalkan
 * @param {boolean} props.isOpen - Status dialog terbuka atau tertutup
 * @returns {JSX.Element}
 */
const ConfirmationDialog = ({ 
  title = "Konfirmasi Tindakan",
  message, 
  confirmText = "Hapus", 
  cancelText = "Batal", 
  confirmIcon = "bi-trash-fill",
  confirmButtonClass = "btn-danger",
  headerClass = "bg-danger",
  onConfirm, 
  onCancel, 
  isOpen 
}) => {
  return (
    <div 
      className={`modal fade ${isOpen ? 'show d-block' : ''}`} 
      tabIndex="-1" 
      role="dialog" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.6)',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        role="document"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        <div className="modal-content shadow-lg rounded-3 border-0">
          <div className={`modal-header ${headerClass} text-white rounded-top-3`}>
            <h5 className="modal-title"><i className="bi bi-exclamation-triangle-fill me-2"></i> {title}</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body p-4">
            {message && message.includes('\n') ? (
              <div className="text-start">
                {message.split('\n').map((line, index) => (
                  <p key={index} className={index === 0 ? 'lead mb-3' : 'mb-2'}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="lead text-center">{message}</p>
            )}
          </div>
          <div className="modal-footer justify-content-center border-top-0 pb-4">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              {cancelText}
            </button>
            <button type="button" className={`btn ${confirmButtonClass}`} onClick={onConfirm}>
              {confirmIcon && <i className={`bi ${confirmIcon} me-1`}></i>} {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;