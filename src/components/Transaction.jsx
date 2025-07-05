import React from 'react';
import { formatRupiah } from '../utils/formatRupiah';

const Transaction = ({ transaction, onDeleteTransaction }) => {
  const sign = transaction.type === 'pengeluaran' ? '-' : '+';
  const amountClass = transaction.type === 'pengeluaran' ? 'text-danger' : 'text-success';
  const listItemClass = transaction.type === 'pengeluaran' ? 'border-start border-danger border-3' : 'border-start border-success border-3';

  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <li className={`list-group-item d-flex justify-content-between align-items-center py-3 ${listItemClass}`}>
      <div className="d-flex flex-column">
        <span className={`fw-bold fs-5 ${amountClass}`}>
          {sign}{formatRupiah(Math.abs(transaction.amount))}
        </span>
        <div className="fw-bold">{transaction.description}</div>
        <small className="text-muted">{transaction.category} &bull; {formattedTransactionDate}</small>
      </div>
      <div>
        <button
          onClick={() => onDeleteTransaction(transaction._id)}
          className="btn btn-outline-danger btn-sm"
          aria-label="Delete transaction"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default Transaction;
