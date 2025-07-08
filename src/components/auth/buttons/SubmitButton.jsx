import React from 'react';

/**
 * SubmitButton - Komponen tombol submit yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {boolean} props.isSubmitting - Apakah form sedang dalam proses submit
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {string} props.loadingText - Teks yang ditampilkan saat loading
 * @param {string} props.defaultText - Teks default tombol
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.variant - Variant tombol (primary, secondary, dll)
 * @param {string} props.className - Kelas tambahan untuk tombol
 * @param {Function} props.onClick - Handler untuk klik tombol (opsional)
 * @param {string} props.type - Tipe tombol (submit, button, reset)
 */
const SubmitButton = ({
  isSubmitting = false,
  disabled = false,
  loadingText = 'Loading...',
  defaultText = 'Submit',
  icon = '',
  variant = 'primary',
  className = '',
  onClick,
  type = 'submit'
}) => {
  return (
    <button 
      type={type} 
      className={`btn btn-${variant} fw-medium ${className}`} 
      disabled={isSubmitting || disabled}
      onClick={onClick}
      style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
    >
      {isSubmitting ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {loadingText}
        </>
      ) : (
        <>
          {icon && <i className={`bi ${icon} me-2`}></i>}
          {defaultText}
        </>
      )}
    </button>
  );
};

export default SubmitButton;