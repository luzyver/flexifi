import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormRange - Komponen input range/slider yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk input range
 * @param {string} props.label - Label untuk input range
 * @param {number} props.value - Nilai input range
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {number} props.min - Nilai minimum range
 * @param {number} props.max - Nilai maksimum range
 * @param {number} props.step - Langkah perubahan nilai
 * @param {boolean} props.required - Apakah input range wajib diisi
 * @param {boolean} props.disabled - Apakah input range dinonaktifkan
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah input range
 * @param {boolean} props.isInvalid - Apakah input range tidak valid
 * @param {string} props.errorText - Pesan error jika input range tidak valid
 * @param {string} props.className - Kelas tambahan untuk input range
 * @param {boolean} props.showValue - Apakah menampilkan nilai saat ini
 * @param {string} props.valuePrefix - Prefix untuk nilai yang ditampilkan
 * @param {string} props.valueSuffix - Suffix untuk nilai yang ditampilkan
 */
const FormRange = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  required = false,
  disabled = false,
  helpText,
  isInvalid = false,
  errorText,
  className = '',
  showValue = true,
  valuePrefix = '',
  valueSuffix = ''
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
      <div className="d-flex align-items-center gap-3">
        <input
          type="range"
          id={id}
          className={`form-range ${isInvalid ? 'is-invalid' : ''} ${className}`}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          required={required}
          disabled={disabled}
        />
        
        {showValue && (
          <div className="range-value bg-light px-2 py-1 rounded border text-center" style={{ minWidth: '60px' }}>
            {valuePrefix}{value}{valueSuffix}
          </div>
        )}
      </div>
    </FormGroup>
  );
};

export default FormRange;