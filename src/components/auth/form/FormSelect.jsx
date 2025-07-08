import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormSelect - Komponen select/dropdown yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk select
 * @param {string} props.label - Label untuk select
 * @param {string} props.value - Nilai select yang dipilih
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {Array} props.options - Array opsi untuk select
 * @param {boolean} props.required - Apakah select wajib diisi
 * @param {boolean} props.disabled - Apakah select dinonaktifkan
 * @param {string} props.placeholder - Placeholder untuk select
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah select
 * @param {boolean} props.isInvalid - Apakah select tidak valid
 * @param {string} props.errorText - Pesan error jika select tidak valid
 * @param {string} props.className - Kelas tambahan untuk select
 */
const FormSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  placeholder = 'Pilih...',
  helpText,
  isInvalid = false,
  errorText,
  className = ''
}) => {
  return (
    <FormGroup
      label={label}
      htmlFor={id}
      required={required}
      helpText={helpText}
      errorText={errorText}
      isInvalid={isInvalid}
    >
      <select
        id={id}
        className={`form-select border ${isInvalid ? 'is-invalid' : ''} ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{ borderRadius: '8px' }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option, index) => (
          <option 
            key={index} 
            value={option.value || option}
          >
            {option.label || option}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};

export default FormSelect;