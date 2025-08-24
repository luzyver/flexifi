import { formatRupiah } from '../../utils/formatRupiah';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Tag, Calendar, Edit, Trash2 } from 'lucide-react';

const Transaction = ({ transaction, onDeleteTransaction, index, isActive, setActiveTransactionId }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const isIncome = transaction.type === 'pemasukan';
  const sign = isIncome ? '+' : '-';

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
      className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
        showOptions ? 'bg-gray-50 dark:bg-gray-700 ring-2 ring-primary-500' : ''
      } ${isIncome ? 'border-l-4 border-success-500' : 'border-l-4 border-danger-500'}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleTransactionClick(e);
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
            isIncome
              ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
              : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
          }`}>
            {isIncome ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 dark:text-white truncate mb-1">
              {transaction.description}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <Tag className="w-3 h-3 mr-1" />
                {transaction.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formattedTransactionDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center ml-4">
          <div className={`text-right font-semibold text-lg ${
            isIncome ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
          }`}>
            {sign}{formatRupiah(Math.abs(transaction.amount))}
          </div>
        </div>

        {/* Options popup */}
        {showOptions && (
          <>
            {/* Mobile overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(false);
                setActiveTransactionId(null);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            />
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-48 animate-fade-in"
              ref={optionsRef}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                    setActiveTransactionId(null);
                    navigate(`/edit-transaction/${transaction._id}`);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors mb-1"
                >
                  <Edit className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>Edit Transaksi</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                    setActiveTransactionId(null);
                    onDeleteTransaction(transaction._id);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                  <span>Hapus Transaksi</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transaction;
