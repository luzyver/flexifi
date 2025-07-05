import React from 'react';
import PropTypes from 'prop-types';
import { formatRupiah } from '../utils/formatRupiah';

const Balance = ({
  income,
  expense,
  balance,
  filterMonth,
  setFilterMonth,
  availableMonths,
}) => {
  return (
    <div className="card-body">
      <h4 className="card-title text-center mb-4">Your Balance</h4>
      <h1 className="display-3 text-center mb-4">{formatRupiah(balance)}</h1>

      <div className="row text-center mb-4">
        <div className="col">
          <div className="card bg-light mb-3">
            <div className="card-body">
              <h5 className="card-title text-success">Income</h5>
              <p className="card-text fs-4 text-success">{formatRupiah(income)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card bg-light mb-3">
            <div className="card-body">
              <h5 className="card-title text-danger">Expense</h5>
              <p className="card-text fs-4 text-danger">{formatRupiah(expense)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="monthFilter" className="form-label">Filter by Month:</label>
        <select
          className="form-select"
          id="monthFilter"
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
    </div>
  );
};

Balance.propTypes = {
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  filterMonth: PropTypes.string.isRequired,
  setFilterMonth: PropTypes.func.isRequired,
  availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Balance;