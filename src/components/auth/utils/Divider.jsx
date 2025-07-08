import React from 'react';

/**
 * Divider - Komponen untuk membuat pemisah antar bagian form
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks yang ditampilkan di tengah divider
 * @param {string} props.className - Kelas tambahan untuk divider
 * @param {Object} props.style - Style tambahan untuk divider
 * @param {string} props.variant - Variant divider (default, dashed, dotted)
 */
const Divider = ({
  text,
  className = '',
  style = {},
  variant = 'default'
}) => {
  // Tentukan style border berdasarkan variant
  let borderStyle = 'solid';
  if (variant === 'dashed') borderStyle = 'dashed';
  if (variant === 'dotted') borderStyle = 'dotted';
  
  // Jika ada teks, gunakan divider dengan teks di tengah
  if (text) {
    return (
      <div 
        className={`position-relative d-flex align-items-center my-4 ${className}`}
        style={style}
      >
        <div 
          className="flex-grow-1 border-bottom" 
          style={{ borderStyle }}
        ></div>
        <span className="px-3 text-muted small">{text}</span>
        <div 
          className="flex-grow-1 border-bottom" 
          style={{ borderStyle }}
        ></div>
      </div>
    );
  }
  
  // Jika tidak ada teks, gunakan divider sederhana
  return (
    <hr 
      className={`my-4 ${className}`} 
      style={{ 
        borderStyle,
        ...style 
      }} 
    />
  );
};

export default Divider;