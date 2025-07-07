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
    <div className="text-center">
      <h4 className="mb-4 text-white-50">Your Current Balance</h4>
      
      <div className="balance-amount text-white mb-4">
        {formatRupiah(balance)}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="d-flex flex-column">
            <span className="text-white-50 small text-uppercase fw-semibold">Income</span>
            <span className="h5 text-success mb-0">{formatRupiah(income)}</span>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex flex-column">
            <span className="text-white-50 small text-uppercase fw-semibold">Expense</span>
            <span className="h5 text-danger mb-0">{formatRupiah(expense)}</span>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-group">
            <label htmlFor="monthFilter" className="form-label text-white-50 small text-uppercase fw-semibold">
              Filter by Month
            </label>
            <select
              className="form-select"
              id="monthFilter"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + '-02').toLocaleString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
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