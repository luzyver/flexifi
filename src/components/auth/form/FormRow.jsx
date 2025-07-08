import React from 'react';

/**
 * FormRow - Komponen untuk mengelompokkan beberapa input dalam satu baris
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten form row (biasanya FormGroup)
 * @param {string} props.className - Kelas tambahan untuk form row
 * @param {Object} props.style - Style tambahan untuk form row
 * @param {number} props.gap - Jarak antar kolom (1-5)
 */
const FormRow = ({
  children,
  className = '',
  style = {},
  gap = 3
}) => {
  return (
    <div 
      className={`row g-${gap} ${className}`}
      style={style}
    >
      {React.Children.map(children, (child, index) => {
        // Jika child adalah null atau undefined, lewati
        if (!child) return null;
        
        // Jika child sudah memiliki className col-*, gunakan apa adanya
        if (child.props && child.props.className && child.props.className.includes('col-')) {
          return child;
        }
        
        // Jika tidak, bungkus dalam div dengan kelas col
        return (
          <div key={index} className="col-12 col-md-6">
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default FormRow;