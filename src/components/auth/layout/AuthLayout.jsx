import React from 'react';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

/**
 * AuthLayout - Komponen layout untuk halaman autentikasi (login dan register)
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten form yang akan ditampilkan di sisi kanan
 * @param {string} props.title - Judul utama yang ditampilkan di sisi kiri
 * @param {string} props.subtitle - Subjudul yang ditampilkan di sisi kiri
 * @param {string} props.icon - Kelas ikon Bootstrap yang ditampilkan di sisi kiri
 * @param {boolean} props.animateForm - State untuk mengontrol animasi
 */
const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon = "bi-wallet2",
  animateForm = false
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="auth-page-container min-vh-100 d-flex align-items-center" 
         style={{
           background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
           backgroundSize: 'cover',
           backgroundAttachment: 'fixed'
         }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-10 col-xl-9">
            <div className={`card border-0 shadow-sm overflow-hidden ${animateForm ? 'animate__animated animate__fadeIn' : 'opacity-0'}`} 
                 style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div className="row g-0">
                {/* Left Side - Brand/Image */}
                <div className="col-lg-5 d-none d-lg-block position-relative overflow-hidden">
                  <div className="h-100" style={{
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    padding: '2.5rem'
                  }}>
                    <div className="position-relative h-100 d-flex flex-column justify-content-between z-index-1">
                      <AuthHeader 
                        title={title}
                        subtitle={subtitle}
                        icon={icon}
                        variant="auth"
                        className="mb-5"
                      />
                      
                      <AuthFooter variant="auth" />
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Form Content */}
                <div className="col-lg-7 bg-white">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column">
                    {/* Mobile logo - only visible on small screens */}
                    <div className="text-center d-block d-lg-none mb-4">
                      <i className={`bi ${icon} text-primary display-5`}></i>
                      <h2 className="h3 fw-bold text-primary">FlexiFi</h2>
                    </div>
                    
                    {/* Form content passed as children */}
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;