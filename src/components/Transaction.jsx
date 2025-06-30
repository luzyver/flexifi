import React from 'react';
import { formatRupiah } from '../utils/formatCurrency';

const Transaction = ({ transaction, onDeleteTransaction }) => {
  const sign = transaction.type === 'pengeluaran' ? '-' : '+';
  const transactionClass = transaction.type === 'pengeluaran' ? 'minus' : 'plus';

  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC' // Use UTC to avoid timezone issues
  });

  return (
    <li className={transactionClass}>
      <div className="transaction-details">
        <span>{transaction.description}</span>
        <span className="category-date">
          {transaction.category} &bull; {formattedTransactionDate}
        </span>
      </div>
      <span className="transaction-amount">
        {sign}{formatRupiah(Math.abs(transaction.amount))}
      </span>
      <button onClick={() => onDeleteTransaction(transaction._id)} className="delete-btn">x</button>
    </li>
  );
};

export default Transaction;
