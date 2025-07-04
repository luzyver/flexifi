import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ title, transactions, onDeleteTransaction, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="card shadow-lg mb-4 border-0 rounded-3">
      <div className="card-header bg-light text-primary py-3 d-flex align-items-center rounded-top-3">
        <i className="bi bi-list-ul me-2 fs-5"></i>
        <h3 className="mb-0 text-primary">{title}</h3>
      </div>
      <div className="card-body p-0">
        {transactionsToDisplay.length > 0 ? (
          <ul className="list-group list-group-flush">
            {transactionsToDisplay.map((transaction) => (
              <Transaction
                key={transaction._id}
                transaction={transaction}
                onDeleteTransaction={onDeleteTransaction}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted p-4 mb-0 fs-5">No transactions found for this period.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
