import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormRadioGroup - Komponen radio button group yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.name - Nama untuk radio button group
 * @param {string} props.label - Label untuk radio button group
 * @param {string} props.value - Nilai radio button yang dipilih
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {Array} props.options - Array opsi untuk radio button
 * @param {boolean} props.required - Apakah radio button wajib diisi
 * @param {boolean} props.disabled - Apakah radio button dinonaktifkan
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah radio button
 * @param {boolean} props.isInvalid - Apakah radio button tidak valid
 * @param {string} props.errorText - Pesan error jika radio button tidak valid
 * @param {string} props.className - Kelas tambahan untuk radio button group
 * @param {boolean} props.inline - Apakah radio button ditampilkan secara inline
 */
const FormRadioGroup = ({
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  helpText,
  isInvalid = false,
  errorText,
  className = '',
  inline = false
}) => {
  return (
    <FormGroup
      label={label}
      required={required}
      helpText={helpText}
      errorText={errorText}
      isInvalid={isInvalid}
      className={className}
    >
      <div>
        {options.map((option, index) => {
          const id = `${name}_${index}`;
          const optionValue = option.value || option;
          const optionLabel = option.label || option;
          
          return (
            <div 
              key={id} 
              className={`form-check ${inline ? 'form-check-inline' : 'mb-2'}`}
            >
              <input
                type="radio"
                className={`form-check-input ${isInvalid ? 'is-invalid' : ''}`}
                id={id}
                name={name}
                value={optionValue}
                checked={value === optionValue}
                onChange={onChange}
                required={required}
                disabled={disabled}
              />
              <label className="form-check-label" htmlFor={id}>
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>
    </FormGroup>
  );
};

export default FormRadioGroup;