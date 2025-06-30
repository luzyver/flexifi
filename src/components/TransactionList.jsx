import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ title, transactions, onDeleteTransaction, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="transaction-history">
      <h3>{title}</h3>
      {transactionsToDisplay.length > 0 ? (
        <ul className="list">
          {transactionsToDisplay.map((transaction) => (
            <Transaction
              key={transaction._id}
              transaction={transaction}
              onDeleteTransaction={onDeleteTransaction}
            />
          ))}
        </ul>
      ) : (
        <p>No transactions found for this period.</p>
      )}
    </div>
  );
};

export default TransactionList;
