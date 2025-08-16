import { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }
    
    // Calculate password strength
    let calculatedStrength = 0;
    
    // Length check
    if (password.length >= 6) calculatedStrength += 1;
    if (password.length >= 8) calculatedStrength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) calculatedStrength += 1; // Has uppercase
    if (/[a-z]/.test(password)) calculatedStrength += 1; // Has lowercase
    if (/[0-9]/.test(password)) calculatedStrength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) calculatedStrength += 1; // Has special char
    
    // Normalize to 0-4 scale
    const normalizedStrength = Math.min(4, Math.floor(calculatedStrength / 1.5));
    setStrength(normalizedStrength);
    
    // Set label based on strength
    const labels = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    setLabel(labels[normalizedStrength]);
  }, [password]);
  
  // Don't render anything if password is empty
  if (!password) return null;
  
  // Determine color based on strength
  const getColor = () => {
    const colors = ['', 'var(--danger-color)', 'var(--warning-color)', 'var(--success-color)', 'var(--success-color)'];
    return colors[strength];
  };
  
  return (
    <div className="password-strength-meter mt-2">
      <div className="d-flex align-items-center">
        <div className="progress flex-grow-1" style={{ height: '6px' }}>
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="progress-bar" 
              role="progressbar"
              style={{
                width: '25%',
                backgroundColor: index < strength ? getColor() : 'var(--border-color)',
                transition: 'background-color 0.3s ease'
              }}
              aria-valuenow={strength >= index + 1 ? 25 : 0}
              aria-valuemin="0" 
              aria-valuemax="25"
            ></div>
          ))}
        </div>
        {label && (
          <span className="ms-2 small" style={{ color: getColor(), fontWeight: 500 }}>
            {label}
          </span>
        )}
      </div>
      
      {/* Password requirements */}
      <div className="password-requirements mt-2">
        <div className="row g-2">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className={`bi ${password.length >= 6 ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-1 small`}></i>
              <small className="text-muted">Min. 6 karakter</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className={`bi ${/[A-Z]/.test(password) ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-1 small`}></i>
              <small className="text-muted">Huruf besar</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className={`bi ${/[0-9]/.test(password) ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-1 small`}></i>
              <small className="text-muted">Angka</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className={`bi ${/[^A-Za-z0-9]/.test(password) ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-1 small`}></i>
              <small className="text-muted">Karakter khusus</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;