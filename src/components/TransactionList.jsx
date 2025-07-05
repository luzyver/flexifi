import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ transactions, onDeleteTransaction, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

  return (
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
  );
};

export default TransactionList;
