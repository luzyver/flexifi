import { formatRupiah } from '../utils/formatRupiah';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Transaction = ({ transaction, onDeleteTransaction, index, isActive, setActiveTransactionId }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const isIncome = transaction.type === 'pemasukan';
  const sign = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'text-success' : 'text-danger';
  const iconClass = isIncome ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill';

  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
  
  // We'll use local state only for controlling popup visibility
  // and only sync with parent when we need to close other popups
  useEffect(() => {
    if (isActive === false && showOptions === true) {
      // Only close this popup if parent explicitly wants to close it
      setShowOptions(false);
    }
  }, [isActive, transaction._id, showOptions]);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only process if options are shown
      if (showOptions) {
        // Check if click was outside the popup and not on the transaction item itself
        if (optionsRef.current && !optionsRef.current.contains(event.target) && 
            !event.target.closest('.modern-transaction-item')) {
          setShowOptions(false);
          setActiveTransactionId(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActiveTransactionId, showOptions]);
  
  const handleTransactionClick = (e) => {
    // Prevent event bubbling and default behavior
    e.stopPropagation();
    e.preventDefault();
    
    // Toggle options visibility
    const newOptionsState = !showOptions;
    
    if (newOptionsState) {
      // Opening the popup - set this transaction as active
      setActiveTransactionId(transaction._id);
    } else {
      // Closing the popup - clear active transaction
      setActiveTransactionId(null);
    }
    
    // Update local state
    setShowOptions(newOptionsState);
  };

  return (
    <div 
      className={`modern-transaction-item ${isIncome ? 'income' : 'expense'} slide-in position-relative cursor-pointer ${showOptions ? 'active-transaction' : ''}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transition: 'all 0.2s ease',
        transform: showOptions ? 'translateX(5px)' : 'none',
        boxShadow: showOptions ? '0 0 0 2px var(--primary-color)' : 'none',
        position: 'relative',
        zIndex: showOptions ? 1 : 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleTransactionClick(e);
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center flex-grow-1">
          <div className={`transaction-icon ${isIncome ? 'income' : 'expense'}`}>
            <i className={`bi ${iconClass}`}></i>
          </div>
          
          <div className="flex-grow-1 min-w-0">
            <div className="transaction-description text-truncate mb-1">
              {transaction.description}
            </div>
            <div className="transaction-meta">
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2">
                <span className="modern-badge light">
                  <i className="bi bi-tag-fill me-1"></i>
                  {transaction.category}
                </span>
                <span className="text-muted small">
                  <i className="bi bi-calendar3 me-1"></i>
                  {formattedTransactionDate}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex align-items-center ms-3">
          <div className={`transaction-amount ${amountClass} text-end`}>
            <div className="fw-bold">
              {sign}{formatRupiah(Math.abs(transaction.amount))}
            </div>
          </div>
        </div>
        
        {/* Options popup */}
        {showOptions && (
          <>
            {/* Mobile overlay */}
            <div 
              className="mobile-popup-overlay d-md-none"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(false);
                setActiveTransactionId(null);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1050,
                animation: 'fadeIn 0.2s ease-in-out',
                backdropFilter: 'blur(2px)'
              }}
            />
            <div 
              className="transaction-options-popup" 
              ref={optionsRef}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{ 
                zIndex: 1060, 
                minWidth: '180px',
                border: '1px solid rgba(0,0,0,0.1)',
                animation: 'fadeIn 0.2s ease-in-out',
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'var(--card-bg)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '8px'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Menutup popup opsi sebelum navigasi
                  setShowOptions(false);
                  setActiveTransactionId(null);
                  navigate(`/edit-transaction/${transaction._id}`);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                className="d-flex align-items-center gap-2 btn btn-sm w-100 text-start mb-1"
              >
                <i className="bi bi-pencil text-primary"></i>
                <span>Edit Transaksi</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Menutup popup opsi sebelum menampilkan dialog konfirmasi
                  setShowOptions(false);
                  setActiveTransactionId(null);
                  // Memanggil fungsi onDeleteTransaction yang akan menampilkan dialog konfirmasi
                  onDeleteTransaction(transaction._id);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                className="d-flex align-items-center gap-2 btn btn-sm w-100 text-start"
              >
                <i className="bi bi-trash text-danger"></i>
                <span>Hapus Transaksi</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transaction;