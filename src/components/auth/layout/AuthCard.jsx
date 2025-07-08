import React from 'react';

/**
 * AuthCard - Komponen kartu untuk halaman autentikasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.title - Judul kartu
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.description - Deskripsi kartu
 * @param {string} props.className - Kelas tambahan untuk kartu
 * @param {Object} props.style - Style tambahan untuk kartu
 */
const AuthCard = ({
  title,
  icon,
  description,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`card border-0 shadow-sm ${className}`} 
      style={{ 
        borderRadius: '16px',
        ...style
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-center mb-2">
          {icon && (
            <div className="icon-wrapper bg-primary bg-opacity-10 p-2 rounded-circle me-2">
              <i className={`bi ${icon} text-primary fs-5`}></i>
            </div>
          )}
          <h6 className="card-title mb-0">{title}</h6>
        </div>
        {description && <p className="card-text text-muted small">{description}</p>}
      </div>
    </div>
  );
};

export default AuthCard;