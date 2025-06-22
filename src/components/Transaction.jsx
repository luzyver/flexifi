// client/src/components/Transaction.jsx
import React from 'react';
import { formatRupiah } from '../utils/formatCurrency'; // Import fungsi helper

const Transaction = ({ transaction, onDeleteTransaction }) => {
  const sign = transaction.type === 'expense' ? '-' : '+'; // Tanda tetap ada
  const transactionClass = transaction.type === 'expense' ? 'minus' : 'plus';

  // Format tanggal transaksi (transaction.date) ke WIB
  // Note: transaction.date adalah tanggal yang diinput user
  const formattedTransactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short', // Misal: Jun
    day: 'numeric',
    timeZone: 'Asia/Jakarta' // Pastikan ini dikonversi ke WIB
  });

  // Format tanggal dibuat (transaction.createdAt) ke WIB
  // Note: transaction.createdAt adalah timestamp otomatis dari MongoDB (UTC)
  const formattedCreatedAt = new Date(transaction.createdAt).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Untuk format 24 jam (misal: 14:30)
    timeZone: 'Asia/Jakarta' // Penting: Konversi dari UTC ke WIB
  });

  return (
    <li className={transactionClass}>
      <button onClick={() => onDeleteTransaction(transaction._id)} className="delete-btn">x</button>
      <div className="transaction-details">
        <span>{transaction.description}</span>
        <span className="category-date">
          {transaction.category} - {formattedTransactionDate}
        </span>
        {/* Menambahkan tampilan createdAt dalam WIB */}
        <span className="created-at">
          Dibuat: {formattedCreatedAt}
        </span>
      </div>
      <span className="transaction-amount">
        {/* Terapkan formatRupiah di sini */}
        {sign}{formatRupiah(Math.abs(transaction.amount))}
      </span>
    </li>
  );
};

export default Transaction;