// client/src/pages/HistoryPage.jsx
import React from 'react';
import TransactionList from '../components/TransactionList';

const HistoryPage = ({ transactions, onDeleteTransaction, filterMonth, setFilterMonth, availableMonths }) => {
  return (
    <>
      <h1>Transaction History</h1> {/* Moved H1 here */}
      <div className="history-page-layout"> {/* New wrapper div for history page content */}
        <div className="card filter-section"> {/* Added card class */}
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
        <div className="card transaction-history"> {/* Added card class */}
          <h3>All Transactions</h3>
          <TransactionList transactions={transactions} onDeleteTransaction={onDeleteTransaction} />
        </div>
      </div>
    </>
  );
};

export default HistoryPage;