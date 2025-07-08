import React from 'react';
import FormGroup from './FormGroup';

/**
 * FormDatePicker - Komponen input tanggal yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk input tanggal
 * @param {string} props.label - Label untuk input tanggal
 * @param {string} props.value - Nilai input tanggal (format YYYY-MM-DD)
 * @param {Function} props.onChange - Handler untuk perubahan nilai
 * @param {boolean} props.required - Apakah input tanggal wajib diisi
 * @param {boolean} props.disabled - Apakah input tanggal dinonaktifkan
 * @param {string} props.min - Nilai minimum tanggal (format YYYY-MM-DD)
 * @param {string} props.max - Nilai maksimum tanggal (format YYYY-MM-DD)
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah input tanggal
 * @param {boolean} props.isInvalid - Apakah input tanggal tidak valid
 * @param {string} props.errorText - Pesan error jika input tanggal tidak valid
 * @param {string} props.className - Kelas tambahan untuk input tanggal
 */
const FormDatePicker = ({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  min,
  max,
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
      <input
        type="date"
        id={id}
        className={`form-control form-control-lg border-2 ${isInvalid ? 'is-invalid' : ''} ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        style={{ borderRadius: '12px' }}
      />
    </FormGroup>
  );
};

export default FormDatePicker;