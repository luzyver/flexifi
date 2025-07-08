import React from 'react';

/**
 * Pagination - Komponen untuk navigasi halaman
 * 
 * @param {Object} props - Props komponen
 * @param {number} props.currentPage - Halaman saat ini
 * @param {number} props.totalPages - Total halaman
 * @param {Function} props.onPageChange - Fungsi yang dipanggil saat halaman berubah
 * @param {number} props.siblingCount - Jumlah halaman yang ditampilkan di sekitar halaman saat ini
 * @param {boolean} props.showFirstLast - Apakah tombol first/last ditampilkan
 * @param {string} props.size - Ukuran pagination (sm, md, lg)
 * @param {string} props.className - Kelas tambahan untuk komponen
 * @param {Object} props.style - Style tambahan untuk komponen
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  className = '',
  style = {}
}) => {
  // Validasi props
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // Tentukan kelas ukuran
  const sizeClass = {
    sm: 'pagination-sm',
    md: '',
    lg: 'pagination-lg'
  }[size];
  
  // Fungsi untuk menghasilkan range halaman
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  
  // Fungsi untuk menghasilkan array halaman yang akan ditampilkan
  const getPageNumbers = () => {
    // Jika total halaman <= 7, tampilkan semua halaman
    if (totalPages <= 7) {
      return range(1, totalPages);
    }
    
    // Hitung halaman yang akan ditampilkan
    const leftSiblingIndex = Math.max(validCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(validCurrentPage + siblingCount, totalPages);
    
    // Tentukan apakah akan menampilkan dots
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Kasus 1: Tampilkan dots di kanan
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      
      return [...leftRange, 'DOTS', totalPages];
    }
    
    // Kasus 2: Tampilkan dots di kiri
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      
      return [1, 'DOTS', ...rightRange];
    }
    
    // Kasus 3: Tampilkan dots di kiri dan kanan
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      
      return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }
  };
  
  // Handler untuk klik halaman
  const handlePageChange = (page) => {
    if (page !== validCurrentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  // Render pagination
  const pageNumbers = getPageNumbers();
  
  return (
    <nav aria-label="Page navigation" className={className} style={style}>
      <ul className={`pagination ${sizeClass} justify-content-center`}>
        {/* Tombol Previous */}
        <li className={`page-item ${validCurrentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageChange(validCurrentPage - 1)}
            aria-label="Previous"
            disabled={validCurrentPage === 1}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        
        {/* Tombol First */}
        {showFirstLast && validCurrentPage > 3 && (
          <li className="page-item">
            <button 
              className="page-link" 
              onClick={() => handlePageChange(1)}
            >
              <i className="bi bi-chevron-double-left small"></i>
            </button>
          </li>
        )}
        
        {/* Halaman */}
        {pageNumbers.map((page, index) => {
          if (page === 'DOTS') {
            return (
              <li className="page-item disabled" key={`dots-${index}`}>
                <span className="page-link">...</span>
              </li>
            );
          }
          
          return (
            <li 
              className={`page-item ${page === validCurrentPage ? 'active' : ''}`} 
              key={page}
            >
              <button 
                className="page-link" 
                onClick={() => handlePageChange(page)}
                aria-current={page === validCurrentPage ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}
        
        {/* Tombol Last */}
        {showFirstLast && validCurrentPage < totalPages - 2 && (
          <li className="page-item">
            <button 
              className="page-link" 
              onClick={() => handlePageChange(totalPages)}
            >
              <i className="bi bi-chevron-double-right small"></i>
            </button>
          </li>
        )}
        
        {/* Tombol Next */}
        <li className={`page-item ${validCurrentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageChange(validCurrentPage + 1)}
            aria-label="Next"
            disabled={validCurrentPage === totalPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;