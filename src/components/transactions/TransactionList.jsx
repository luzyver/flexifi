import Transaction from './Transaction';
import { useState, useEffect } from 'react';

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
    <div className="transaction-list">
      {transactionsToDisplay.length > 0 ? (
        <div className="list-group list-group-flush">
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
        <div className="text-center py-4 py-md-5">
          <i className="bi bi-inbox display-1 text-muted mb-3"></i>
          <h5 className="text-muted mb-2">Tidak ada transaksi ditemukan</h5>
          <p className="text-muted mb-0 small">Tidak ada transaksi yang sesuai dengan kriteria filter Anda saat ini.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;