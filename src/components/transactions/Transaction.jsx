import { memo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { formatRupiah } from '../../utils/formatRupiah';
import { ArrowUpRight, ArrowDownRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const Transaction = memo(function Transaction({
  transaction,
  onDeleteTransaction,
  index,
  isActive,
  setActiveTransactionId,
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isIncome = transaction.type === 'pemasukan';

  useEffect(() => {
    if (!isActive) setShowMenu(false);
  }, [isActive]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
        setActiveTransactionId(null);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', () => setShowMenu(false), true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', () => setShowMenu(false), true);
    };
  }, [showMenu, setActiveTransactionId]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 88; // approximate menu height
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // Position menu above if not enough space below
      if (spaceBelow < menuHeight + 10) {
        setMenuPosition({
          top: rect.top - menuHeight - 4,
          left: rect.right - 144, // menu width
        });
      } else {
        setMenuPosition({
          top: rect.bottom + 4,
          left: rect.right - 144,
        });
      }
    }
    
    const newState = !showMenu;
    setShowMenu(newState);
    setActiveTransactionId(newState ? transaction._id : null);
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setActiveTransactionId(null);
    navigate(`/edit-transaction/${transaction._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setActiveTransactionId(null);
    onDeleteTransaction(transaction._id);
  };

  // Render menu using portal to avoid overflow issues
  const menuPortal = showMenu && createPortal(
    <div
      ref={menuRef}
      className="fixed w-36 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1 z-[100] animate-fade-in"
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
      }}
    >
      <button
        onClick={handleEdit}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit</span>
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span>Hapus</span>
      </button>
    </div>,
    document.body
  );

  return (
    <div
      className="transaction-item group"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isIncome
              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 dark:text-white truncate text-sm sm:text-base">
            {transaction.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {transaction.category}
            </span>
            <span className="text-xs text-slate-500">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Amount & Menu */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <p
          className={`font-bold text-sm sm:text-base whitespace-nowrap ${
            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatRupiah(Math.abs(transaction.amount))}
        </p>

        {/* Menu Button */}
        <button
          ref={buttonRef}
          onClick={handleMenuToggle}
          className={`p-2 rounded-lg transition-colors ${
            showMenu 
              ? 'bg-slate-200 dark:bg-slate-700' 
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      {menuPortal}
    </div>
  );
});

export default Transaction;
