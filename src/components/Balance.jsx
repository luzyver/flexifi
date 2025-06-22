// client/src/components/Balance.jsx
import React from 'react';
import { formatRupiah } from '../utils/formatCurrency'; // Import fungsi helper

const Balance = ({ income, expense, balance }) => {
  return (
    <div className="balance-summary">
      <h2>Your Balance: {formatRupiah(balance)}</h2>
      <div className="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p className="money plus">{formatRupiah(income)}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="money minus">{formatRupiah(expense)}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;