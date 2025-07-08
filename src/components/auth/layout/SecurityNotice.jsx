import React from 'react';

/**
 * SecurityNotice - Komponen untuk menampilkan informasi keamanan
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.title - Judul informasi keamanan
 * @param {Array} props.items - Array item informasi keamanan
 */
const SecurityNotice = ({ 
  title = 'Informasi Keamanan',
  items = [
    'Semua password dienkripsi dan aman',
    'Pendaftaran memerlukan kode aktivasi yang valid',
    'Data akun Anda dilindungi dan bersifat privat'
  ] 
}) => {
  return (
    <div className="alert alert-light border-0 rounded-3 p-2 shadow-sm">
      <h6 className="alert-heading text-primary fw-bold mb-1" style={{ fontSize: '0.85rem' }}>
        <i className="bi bi-shield-check me-1"></i>
        {title}
      </h6>
      <ul className="list-unstyled mb-0" style={{ fontSize: '0.75rem' }}>
        {items.map((item, index) => (
          <li key={index} className={index === items.length - 1 ? 'mb-0' : 'mb-1'}>
            <i className="bi bi-check-circle text-success me-1 small"></i>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SecurityNotice;