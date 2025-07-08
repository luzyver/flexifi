import React from 'react';

/**
 * FormCheckbox - Komponen checkbox yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk checkbox
 * @param {string} props.label - Label untuk checkbox
 * @param {boolean} props.checked - Status checkbox (checked/unchecked)
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {boolean} props.required - Apakah checkbox wajib diisi
 * @param {boolean} props.disabled - Apakah checkbox dinonaktifkan
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah checkbox
 * @param {boolean} props.isInvalid - Apakah checkbox tidak valid
 * @param {string} props.errorText - Pesan error jika checkbox tidak valid
 * @param {string} props.className - Kelas tambahan untuk checkbox
 */
const FormCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  helpText,
  isInvalid = false,
  errorText,
  className = ''
}) => {
  return (
    <div className={`form-check mb-3 ${className}`}>
      <input
        type="checkbox"
        className={`form-check-input ${isInvalid ? 'is-invalid' : ''}`}
        id={id}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
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

export default FormCheckbox;