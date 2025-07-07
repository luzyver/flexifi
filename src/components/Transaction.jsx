import React from 'react';
import { formatRupiah } from '../utils/formatRupiah';

const Transaction = ({ transaction, onDeleteTransaction, index }) => {
  const isIncome = transaction.type === 'pemasukan';
  const sign = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'text-success' : 'text-danger';
  const iconClass = isIncome ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill';
  const borderClass = isIncome ? 'border-success' : 'border-danger';

  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div 
      className={`list-group-item transaction-item ${isIncome ? 'income' : 'expense'} slide-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start">
          <div className={`me-3 mt-1`}>
            <i className={`bi ${iconClass} fs-4 ${amountClass}`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="transaction-description">{transaction.description}</div>
            <div className="transaction-meta">
              <span className="badge bg-light text-dark me-2">
                <i className="bi bi-tag-fill me-1"></i>
                {transaction.category}
              </span>
              <span className="text-muted">
                <i className="bi bi-calendar3 me-1"></i>
                {formattedTransactionDate}
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className={`transaction-amount ${amountClass} me-3 text-end`}>
            <div className="fw-bold">{sign}{formatRupiah(Math.abs(transaction.amount))}</div>
          </div>
          <button
            onClick={() => onDeleteTransaction(transaction._id)}
            className="btn btn-outline-danger btn-sm"
            aria-label="Delete transaction"
            title="Delete transaction"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transaction;