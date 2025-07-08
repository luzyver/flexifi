import React from 'react';
import { formatRupiah } from '../utils/formatRupiah';
import { IconButton, Badge, Tooltip } from './auth';

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
      className={`transaction-item ${isIncome ? 'income' : 'expense'} animate-fade-in hover-lift`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="transaction-icon">
        <i className={`bi ${iconClass} ${amountClass}`}></i>
      </div>
      
      <div className="transaction-content">
        <div className="transaction-description">
          {transaction.description}
        </div>
        <div className="transaction-meta">
          <Badge
            text={transaction.category}
            variant={isIncome ? "success" : "danger"}
            icon="bi bi-tag-fill"
            size="sm"
          />
          <span className="transaction-date">
            <i className="bi bi-calendar3 me-1"></i>
            {formattedTransactionDate}
          </span>
        </div>
      </div>
      
      <div className="transaction-amount-wrapper">
        <div className={`transaction-amount ${amountClass}`}>
          {sign}{formatRupiah(Math.abs(transaction.amount))}
        </div>
      </div>
      
      <div className="transaction-actions">
        <IconButton
          icon="bi bi-trash"
          variant="outline-danger"
          size="sm"
          onClick={() => onDeleteTransaction(transaction._id)}
          tooltip="Hapus transaksi"
          ariaLabel="Hapus transaksi"
          className="hover-scale"
        />
      </div>
    </div>
  );
};

export default Transaction;