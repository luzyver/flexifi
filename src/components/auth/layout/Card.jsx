import React from 'react';

/**
 * Card - Komponen untuk menampilkan konten dalam bentuk kartu
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten kartu
 * @param {string} props.title - Judul kartu
 * @param {string} props.subtitle - Subjudul kartu
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {React.ReactNode} props.image - Gambar kartu (URL atau komponen)
 * @param {React.ReactNode} props.footer - Footer kartu
 * @param {React.ReactNode} props.header - Header kartu
 * @param {string} props.variant - Variant kartu (primary, secondary, dll)
 * @param {boolean} props.outline - Apakah kartu hanya memiliki outline
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 * @param {Function} props.onClick - Fungsi yang dipanggil saat kartu diklik
 * @param {boolean} props.hoverable - Apakah kartu memiliki efek hover
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  image,
  footer,
  header,
  variant = '',
  outline = false,
  className = '',
  bodyClassName = '',
  style = {},
  onClick,
  hoverable = false
}) => {
  // Tentukan kelas variant
  const variantClass = variant ? (outline ? `border-${variant} text-${variant}` : `bg-${variant} text-white`) : '';
  
  // Tentukan kelas hover
  const hoverClass = hoverable ? 'card-hover' : '';
  
  // Tentukan apakah kartu dapat diklik
  const isClickable = !!onClick;
  
  return (
    <div 
      className={`card ${variantClass} ${hoverClass} ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        transition: 'all 0.3s ease',
        ...style
      }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Header */}
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      
      {/* Image */}
      {image && (
        <div className="card-img-top">
          {typeof image === 'string' ? (
            <img src={image} alt={title || 'Card image'} className="img-fluid" />
          ) : (
            image
          )}
        </div>
      )}
      
      {/* Body */}
      <div className={`card-body ${bodyClassName}`}>
        {/* Title */}
        {(title || icon) && (
          <div className="card-title h6 d-flex align-items-center">
            {icon && <i className={`bi ${icon} me-2`}></i>}
            {title}
          </div>
        )}
        
        {/* Subtitle */}
        {subtitle && (
          <div className="card-subtitle mb-2 small text-muted">
            {subtitle}
          </div>
        )}
        
        {/* Content */}
        <div className="card-text">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;