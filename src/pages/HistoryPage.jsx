// client/src/pages/HistoryPage.jsx
import React from 'react';
import TransactionList from '../components/TransactionList';

const HistoryPage = ({ transactions, onDeleteTransaction, filterMonth, setFilterMonth, availableMonths }) => {
  return (
    <>
      <div className="filter-section"> {/* Pastikan gaya untuk ini ada di CSS Anda */}
        <h3>Filter Transactions</h3>
        <label htmlFor="filterMonth">Select Month:</label>
        <select
          id="filterMonth"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </div>
      <TransactionList transactions={transactions} onDeleteTransaction={onDeleteTransaction} />
    </>
  );
};

export default HistoryPage;