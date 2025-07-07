import React from 'react';
import { formatRupiah } from '../utils/formatRupiah';

const Transaction = ({ transaction, onDeleteTransaction, index }) => {
  const isIncome = transaction.type === 'pemasukan';
  const sign = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'text-success' : 'text-danger';
  const iconClass = isIncome ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill';

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
        <div className="d-flex align-items-start flex-grow-1">
          <div className="me-2 me-md-3 mt-1">
            <i className={`bi ${iconClass} fs-5 fs-md-4 ${amountClass}`}></i>
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="transaction-description text-truncate">{transaction.description}</div>
            <div className="transaction-meta d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
              <span className="badge bg-light text-dark me-0 me-sm-2 mb-1 mb-sm-0">
                <i className="bi bi-tag-fill me-1"></i>
                {transaction.category}
              </span>
              <span className="text-muted small">
                <i className="bi bi-calendar3 me-1"></i>
                {formattedTransactionDate}
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center ms-2">
          <div className={`transaction-amount ${amountClass} me-2 me-md-3 text-end`}>
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