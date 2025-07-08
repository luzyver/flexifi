import React from 'react';

/**
 * AuthFooter - Komponen footer untuk halaman autentikasi
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.text - Teks copyright
 * @param {string} props.className - Kelas tambahan untuk footer
 * @param {string} props.variant - Variant tampilan (default, auth)
 */
const AuthFooter = ({
  text,
  className = '',
  variant = 'default'
}) => {
  const currentYear = new Date().getFullYear();
  const footerText = text || `© ${currentYear} FlexiFi. All rights reserved.`;
  
  // Jika variant adalah auth, tampilkan versi khusus
  if (variant === 'auth') {
    return (
      <div className={`${className}`}>
        <small className="text-white-50 opacity-75">
          {footerText}
        </small>
      </div>
    );
  }
  
  // Tampilan default
  return (
    <div className={`${className}`}>
      <small className="text-muted opacity-75">
        {footerText}
      </small>
    </div>
  );
};

export default AuthFooter;