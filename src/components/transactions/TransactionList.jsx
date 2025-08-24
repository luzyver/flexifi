import Transaction from './Transaction';
import { useState, useEffect } from 'react';
import { Inbox } from 'lucide-react';

const TransactionList = ({ transactions, onDeleteTransaction, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;
  const [activeTransactionId, setActiveTransactionId] = useState(null);

  // Debug activeTransactionId changes
  useEffect(() => {
    // Monitor active transaction ID changes
  }, [activeTransactionId]);

  // Custom function to set active transaction ID with debugging
  const handleSetActiveTransactionId = (id) => {
    // If we're setting to null (closing) or setting to a new ID (opening a different popup)
    // then update the active ID
    if (id === null) {
      // Closing a popup
      setActiveTransactionId(null);
    } else if (id !== activeTransactionId) {
      // Opening a new popup - close any existing popup first
      setActiveTransactionId(id);
    }
    // If id === activeTransactionId, we're toggling the same popup, so don't change parent state
  };

  return (
    <div className="space-y-0">
      {transactionsToDisplay.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactionsToDisplay.map((transaction, index) => (
            <Transaction
              key={transaction._id}
              transaction={transaction}
              onDeleteTransaction={onDeleteTransaction}
              index={index}
              isActive={activeTransactionId === transaction._id}
              setActiveTransactionId={handleSetActiveTransactionId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ada transaksi ditemukan</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Tidak ada transaksi yang sesuai dengan kriteria filter Anda saat ini.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
