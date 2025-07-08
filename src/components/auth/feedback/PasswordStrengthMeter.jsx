import React, { useEffect, useState } from 'react';

/**
 * PasswordStrengthMeter - Komponen untuk menampilkan kekuatan password
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.password - Password yang akan dievaluasi
 * @param {string} props.className - Kelas tambahan untuk komponen
 */
const PasswordStrengthMeter = ({
  password = '',
  className = ''
}) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  
  useEffect(() => {
    // Jika password kosong, strength 0
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }
    
    // Evaluasi kekuatan password
    let score = 0;
    
    // Panjang password
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Kompleksitas password
    if (/[a-z]/.test(password)) score += 1; // Huruf kecil
    if (/[A-Z]/.test(password)) score += 1; // Huruf besar
    if (/[0-9]/.test(password)) score += 1; // Angka
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // Karakter khusus
    
    // Normalisasi score ke skala 0-4
    const normalizedScore = Math.min(4, Math.floor(score / 6 * 4));
    setStrength(normalizedScore);
    
    // Set label berdasarkan score
    const labels = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    setLabel(labels[normalizedScore]);
  }, [password]);
  
  // Tentukan warna berdasarkan strength
  const getColor = () => {
    const colors = ['', 'danger', 'warning', 'info', 'success'];
    return colors[strength];
  };
  
  // Jika password kosong, jangan tampilkan apa-apa
  if (!password) return null;
  
  return (
    <div className={`password-strength-meter mt-1 ${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="progress w-100" style={{ height: '6px' }}>
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className={`progress-bar bg-${index < strength ? getColor() : 'secondary bg-opacity-25'}`}
              style={{ width: '25%' }}
            ></div>
          ))}
        </div>
        
        {label && (
          <span className={`ms-2 badge text-bg-${getColor()} small`} style={{ fontSize: '0.7rem' }}>
            {label}
          </span>
        )}
      </div>
      
      <div className="password-tips small text-muted" style={{ fontSize: '0.75rem' }}>
        <i className="bi bi-info-circle-fill me-1 opacity-50"></i>
        Password min. 8 karakter dengan huruf besar, kecil, angka, dan karakter khusus.
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;