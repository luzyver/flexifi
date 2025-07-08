import React from 'react';

/**
 * FormContainer - Komponen untuk mengelompokkan beberapa input form dalam satu container
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten form container
 * @param {string} props.title - Judul container
 * @param {string} props.subtitle - Subjudul container
 * @param {string} props.icon - Kelas ikon Bootstrap
 * @param {string} props.className - Kelas tambahan untuk container
 * @param {Object} props.style - Style tambahan untuk container
 * @param {boolean} props.collapsible - Apakah container dapat di-collapse
 * @param {boolean} props.collapsed - Status awal container (collapsed/expanded)
 */
const FormContainer = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  style = {},
  collapsible = false,
  collapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
  
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const containerStyle = {
    borderRadius: '16px',
    ...style
  };
  
  return (
    <div 
      className={`form-container card border-0 shadow-sm mb-4 ${className}`}
      style={containerStyle}
    >
      {title && (
        <div 
          className={`card-header bg-transparent py-3 ${collapsible ? 'cursor-pointer' : ''}`}
          onClick={toggleCollapse}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {icon && <i className={`bi ${icon} me-2 text-primary`}></i>}
              <div>
                <h5 className="card-title mb-0">{title}</h5>
                {subtitle && <div className="text-muted small">{subtitle}</div>}
              </div>
            </div>
            {collapsible && (
              <i className={`bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'} text-muted`}></i>
            )}
          </div>
        </div>
      )}
      
      <div className={`card-body ${isCollapsed ? 'd-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;