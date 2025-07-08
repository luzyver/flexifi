import React from 'react';

/**
 * FormSwitch - Komponen switch/toggle yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk switch
 * @param {string} props.label - Label untuk switch
 * @param {boolean} props.checked - Status switch (checked/unchecked)
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {boolean} props.required - Apakah switch wajib diisi
 * @param {boolean} props.disabled - Apakah switch dinonaktifkan
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah switch
 * @param {boolean} props.isInvalid - Apakah switch tidak valid
 * @param {string} props.errorText - Pesan error jika switch tidak valid
 * @param {string} props.className - Kelas tambahan untuk switch
 * @param {string} props.onText - Teks saat switch aktif
 * @param {string} props.offText - Teks saat switch tidak aktif
 */
const FormSwitch = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  helpText,
  isInvalid = false,
  errorText,
  className = '',
  onText = 'On',
  offText = 'Off'
}) => {
  return (
    <div className={`form-check form-switch mb-3 ${className}`}>
      <input
        type="checkbox"
        role="switch"
        className={`form-check-input ${isInvalid ? 'is-invalid' : ''}`}
        id={id}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <label className="form-check-label d-flex align-items-center" htmlFor={id}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
        <span className="ms-2 badge bg-light text-dark">
          {checked ? onText : offText}
        </span>
      </label>
      
      {helpText && !isInvalid && (
        <div className="form-text small">
          <i className="bi bi-info-circle me-1"></i>
          {helpText}
        </div>
      )}
      
      {isInvalid && errorText && (
        <div className="invalid-feedback">
          {errorText}
        </div>
      )}
    </div>
  );
};

export default FormSwitch;