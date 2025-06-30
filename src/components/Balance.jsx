import React from 'react';
import { formatRupiah } from '../utils/formatCurrency';

const Balance = ({ income, expense, balance }) => {
  return (
    <div className="balance-summary">
      <h2>{formatRupiah(balance)}</h2>
      <div className="inc-exp-container">
        <div>
          <h4>Pemasukan</h4>
          <p className="money plus">{formatRupiah(income)}</p>
        </div>
        <div>
          <h4>Pengeluaran</h4>
          <p className="money minus">{formatRupiah(expense)}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;