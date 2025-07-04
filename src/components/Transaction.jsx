import React from 'react';
import { formatRupiah } from '../utils/formatCurrency';

const Transaction = ({ transaction, onDeleteTransaction }) => {
  const sign = transaction.type === 'pengeluaran' ? '-' : '+';
  const amountClass = transaction.type === 'pengeluaran' ? 'text-danger' : 'text-success';
  const listItemClass = transaction.type === 'pengeluaran' ? 'border-start border-danger border-2' : 'border-start border-success border-2';

  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <li className={`list-group-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 shadow-sm ${listItemClass} transition-shadow-hover`}>
      <div className="d-flex flex-column">
        <span className={`fw-bold fs-5 ${amountClass}`}>
          {sign}{formatRupiah(Math.abs(transaction.amount))}
        </span>
        <div className="fw-bold fs-5">{transaction.description}</div>
        <small className="text-muted">{transaction.category} &bull; {formattedTransactionDate}</small>
      </div>
      <div>
        <button
          onClick={() => onDeleteTransaction(transaction._id)}
          className="btn btn-outline-danger btn-sm p-1"
          aria-label="Delete transaction"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default Transaction;
