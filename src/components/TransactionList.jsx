// client/src/components/TransactionList.jsx
import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="transaction-history">
      <h3>History</h3>
      <ul className="list">
        {transactions.map((transaction) => (
          <Transaction
            key={transaction._id}
            transaction={transaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;