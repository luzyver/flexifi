import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ transactions, onDeleteTransaction, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 py-md-5 animate-fade-in">
          <i className="bi bi-inbox display-1 text-muted mb-3 animate-pulse"></i>
          <h5 className="text-muted mb-2">Tidak ada transaksi ditemukan</h5>
          <p className="text-muted mb-0 small">Tidak ada transaksi yang sesuai dengan kriteria filter Anda saat ini.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;