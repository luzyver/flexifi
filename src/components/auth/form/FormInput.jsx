import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormInput - Komponen input form yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk input
 * @param {string} props.type - Tipe input (text, password, dll)
 * @param {string} props.label - Label untuk input
 * @param {string} props.value - Nilai input
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {boolean} props.required - Apakah input wajib diisi
 * @param {boolean} props.disabled - Apakah input dinonaktifkan
 * @param {string} props.placeholder - Placeholder untuk input
 * @param {string} props.autoComplete - Nilai autocomplete
 * @param {string} props.minLength - Panjang minimum input
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah input
 * @param {boolean} props.isInvalid - Apakah input tidak valid
 * @param {string} props.invalidFeedback - Pesan error jika input tidak valid
 * @param {boolean} props.showPasswordToggle - Apakah menampilkan tombol toggle password
 * @param {boolean} props.showPassword - State untuk menampilkan/menyembunyikan password
 * @param {Function} props.onTogglePassword - Handler untuk toggle password
 */
const FormInput = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  autoComplete,
  minLength,
  helpText,
  isInvalid = false,
  invalidFeedback,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword
}) => {
  // Jika ini adalah input password dan showPasswordToggle true, sesuaikan tipe
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <FormGroup
      label={label}
      htmlFor={id}
      required={required}
      helpText={helpText}
      errorText={isInvalid && invalidFeedback ? invalidFeedback : null}
      isInvalid={isInvalid}
    >
      <div className="position-relative">
        <input
          type={inputType}
          id={id}
          className={`form-control border ${isInvalid ? 'is-invalid' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          minLength={minLength}
          style={{ borderRadius: '8px' }}
        />
        
        {/* Toggle password visibility button */}
        {showPasswordToggle && (
          <button
            type="button"
            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
            onClick={onTogglePassword}
            disabled={disabled}
            tabIndex="-1"
            style={{ zIndex: 5 }}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-primary`}></i>
          </button>
        )}
      </div>
    </FormGroup>
  );
};

export default FormInput;