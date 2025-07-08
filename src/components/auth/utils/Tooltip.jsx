import React, { useState } from 'react';

/**
 * Tooltip - Komponen untuk menampilkan tooltip pada elemen
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Elemen yang akan diberi tooltip
 * @param {string} props.text - Teks tooltip
 * @param {string} props.placement - Posisi tooltip (top, bottom, left, right)
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 */
const Tooltip = ({
  children,
  text,
  placement = 'top',
  className = '',
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Tentukan kelas posisi
  const placementClass = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right'
  }[placement];
  
  // Style untuk tooltip
  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    zIndex: 1070,
    maxWidth: '200px',
    textAlign: 'center',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.2s',
    ...getPlacementStyle(placement),
    ...style
  };
  
  // Tentukan style berdasarkan posisi
  function getPlacementStyle(placement) {
    switch (placement) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' };
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
    }
  }
  
  return (
    <div 
      className={`position-relative d-inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {text && (
        <div style={tooltipStyle}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;