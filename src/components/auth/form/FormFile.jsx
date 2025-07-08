import React, { useState } from 'react';
import FormGroup from './FormGroup';

/**
 * FormFile - Komponen input file yang dapat digunakan kembali
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.id - ID unik untuk input file
 * @param {string} props.label - Label untuk input file
 * @param {Function} props.onChange - Handler untuk perubahan file
 * @param {boolean} props.required - Apakah input file wajib diisi
 * @param {boolean} props.disabled - Apakah input file dinonaktifkan
 * @param {string} props.accept - Tipe file yang diterima (e.g., 'image/*')
 * @param {boolean} props.multiple - Apakah dapat memilih multiple file
 * @param {string} props.helpText - Teks bantuan yang ditampilkan di bawah input file
 * @param {boolean} props.isInvalid - Apakah input file tidak valid
 * @param {string} props.errorText - Pesan error jika input file tidak valid
 * @param {string} props.className - Kelas tambahan untuk input file
 * @param {string} props.buttonText - Teks pada tombol pilih file
 */
const FormFile = ({
  id,
  label,
  onChange,
  required = false,
  disabled = false,
  accept,
  multiple = false,
  helpText,
  isInvalid = false,
  errorText,
  className = '',
  buttonText = 'Pilih File'
}) => {
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      if (multiple) {
        setFileName(`${files.length} file dipilih`);
      } else {
        setFileName(files[0].name);
      }
    } else {
      setFileName('');
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <FormGroup
      label={label}
      htmlFor={id}
      required={required}
      helpText={helpText}
      errorText={errorText}
      isInvalid={isInvalid}
    >
      <div className="input-group">
        <input
          type="file"
          id={id}
          className={`form-control form-control-lg border-2 ${isInvalid ? 'is-invalid' : ''} ${className}`}
          onChange={handleFileChange}
          required={required}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
          style={{ borderRadius: '12px 0 0 12px' }}
        />
        <label 
          className="input-group-text" 
          htmlFor={id}
          style={{ borderRadius: '0 12px 12px 0' }}
        >
          <i className="bi bi-upload me-2"></i>
          {buttonText}
        </label>
      </div>
      
      {fileName && (
        <div className="selected-file mt-2 small">
          <i className="bi bi-file-earmark me-1"></i>
          {fileName}
        </div>
      )}
    </FormGroup>
  );
};

export default FormFile;