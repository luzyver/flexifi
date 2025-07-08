import React, { useEffect } from 'react';

/**
 * Modal - Komponen untuk menampilkan dialog modal
 * 
 * @param {Object} props - Props komponen
 * @param {boolean} props.show - Apakah modal ditampilkan
 * @param {Function} props.onClose - Fungsi yang dipanggil saat modal ditutup
 * @param {React.ReactNode} props.children - Konten modal
 * @param {string} props.title - Judul modal
 * @param {string} props.size - Ukuran modal (sm, md, lg, xl)
 * @param {boolean} props.centered - Apakah modal ditampilkan di tengah layar
 * @param {boolean} props.backdrop - Apakah backdrop ditampilkan
 * @param {boolean} props.closeButton - Apakah tombol close ditampilkan
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 * @param {React.ReactNode} props.footer - Konten footer modal
 */
const Modal = ({
  show = false,
  onClose,
  children,
  title = '',
  size = 'md',
  centered = false,
  backdrop = true,
  closeButton = true,
  className = '',
  style = {},
  footer = null
}) => {
  // Tentukan kelas ukuran
  const sizeClass = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }[size];
  
  // Efek untuk mengatur scroll body
  useEffect(() => {
    if (show) {
      // Nonaktifkan scroll pada body saat modal terbuka
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Kompensasi scrollbar
      
      // Tambahkan backdrop jika diperlukan
      if (backdrop) {
        const backdropElement = document.createElement('div');
        backdropElement.className = 'modal-backdrop fade show';
        document.body.appendChild(backdropElement);
      }
    } else {
      // Aktifkan kembali scroll pada body saat modal tertutup
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Hapus backdrop jika ada
      const backdropElement = document.querySelector('.modal-backdrop');
      if (backdropElement) {
        backdropElement.remove();
      }
    }
    
    // Cleanup effect
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      const backdropElement = document.querySelector('.modal-backdrop');
      if (backdropElement) {
        backdropElement.remove();
      }
    };
  }, [show, backdrop]);
  
  // Handler untuk klik di luar modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal') && backdrop) {
      onClose();
    }
  };
  
  // Handler untuk tombol escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };
    
    if (show) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);
  
  if (!show) return null;
  
  return (
    <div 
      className={`modal fade ${show ? 'show' : ''} ${className}`} 
      style={{ display: show ? 'block' : 'none', ...style }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div 
        className={`modal-dialog ${sizeClass} ${centered ? 'modal-dialog-centered' : ''}`}
        role="document"
      >
        <div className="modal-content">
          {(title || closeButton) && (
            <div className="modal-header py-2">
              {title && <h6 className="modal-title">{title}</h6>}
              {closeButton && (
                <button 
                  type="button" 
                  className="btn-close btn-close-sm" 
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              )}
            </div>
          )}
          
          <div className="modal-body py-3">
            {children}
          </div>
          
          {footer && (
            <div className="modal-footer py-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;