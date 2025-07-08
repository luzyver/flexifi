import React from 'react';

/**
 * FormGroup - Komponen untuk mengelompokkan input form
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten form group
 * @param {string} props.label - Label form group
 * @param {string} props.htmlFor - ID elemen yang terkait dengan label
 * @param {string} props.className - Kelas tambahan untuk form group
 * @param {boolean} props.required - Apakah field ini wajib diisi
 * @param {string} props.helpText - Teks bantuan untuk form group
 * @param {string} props.errorText - Teks error untuk form group
 * @param {boolean} props.isValid - Apakah input valid
 * @param {boolean} props.isInvalid - Apakah input tidak valid
 */
const FormGroup = ({
  children,
  label,
  htmlFor,
  className = '',
  required = false,
  helpText,
  errorText,
  isValid = false,
  isInvalid = false
}) => {
  return (
    <div className={`form-group mb-2 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="form-label small fw-medium">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {children}
      
      {helpText && !errorText && (
        <small className="form-text text-muted small">{helpText}</small>
      )}
      
      {errorText && (
        <div className="invalid-feedback d-block">{errorText}</div>
      )}
      
      {isValid && !errorText && (
        <div className="valid-feedback d-block">Looks good!</div>
      )}
    </div>
  );
};

export default FormGroup;