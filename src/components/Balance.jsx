import React from 'react';
import { formatRupiah } from '../utils/formatCurrency';

const Balance = ({ income, expense, balance, filterMonth, setFilterMonth, availableMonths }) => {
  return (
    <div className="card text-center my-3 p-4 shadow-lg border-0 rounded-3 bg-white">
      <div className="mb-4 pb-3 border-bottom border-light">
        <label htmlFor="filterMonth" className="form-label text-muted">Select Month:</label>
        <select
          id="filterMonth"
          className="form-select form-select-lg bg-light text-dark border-secondary"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {new Date(month + '-02').toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </div>
      <h5 className="card-title text-muted mb-3">Current Balance</h5>
      <h2 className="card-text mb-4 fw-bold display-6 text-primary">{formatRupiah(balance)}</h2>
      <div className="d-flex flex-column">
        <div className="py-3 border-bottom border-light mb-3">
          <h4 className="text-primary mb-1">Income</h4>
          <p className="fs-5 fw-bold text-success">{formatRupiah(income)}</p>
        </div>
        <div className="py-3">
          <h4 className="text-primary mb-1">Expense</h4>
          <p className="fs-5 fw-bold text-danger">{formatRupiah(expense)}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;