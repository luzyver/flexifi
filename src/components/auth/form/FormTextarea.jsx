import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormTextarea - Komponen textarea yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk textarea
 * @param {string} props.label - Label untuk textarea
 * @param {string} props.value - Nilai textarea
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {boolean} props.required - Apakah textarea wajib diisi
 * @param {boolean} props.disabled - Apakah textarea dinonaktifkan
 * @param {string} props.placeholder - Placeholder untuk textarea
 * @param {number} props.rows - Jumlah baris textarea
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah textarea
 * @param {boolean} props.isInvalid - Apakah textarea tidak valid
 * @param {string} props.errorText - Pesan error jika textarea tidak valid
 * @param {string} props.className - Kelas tambahan untuk textarea
 */
const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  rows = 4,
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
      <textarea
        id={id}
        className={`form-control form-control-lg border-2 ${isInvalid ? 'is-invalid' : ''} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        style={{ borderRadius: '12px' }}
      />
    </FormGroup>
  );
};

export default FormTextarea;