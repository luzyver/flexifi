// client/src/pages/HomePage.jsx
import React from 'react';
import Balance from '../components/Balance';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';

const HomePage = ({
  income,
  expense,
  balance,
  onAddTransaction,
  transactions,
  onDeleteTransaction,
  filterMonth, // New prop
  setFilterMonth, // New prop
  availableMonths, // New prop
}) => {
  return (
    <>
      <h1>Money Tracker Dashboard</h1>
      <div className="home-page-layout">
        <div className="card balance-card">
          <h3>Your Balance</h3>
          <Balance income={income} expense={expense} balance={balance} />
        </div>

        {/* Month Filter moved here */}
        <div className="card filter-section">
          <h3>Filter Transactions by Month</h3>
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

        <div className="card add-transaction-form">
          <h3>Add New Transaction</h3>
          <AddTransaction onAddTransaction={onAddTransaction} />
        </div>

        {/* Display recent transactions on the home page */}
        <div className="card transaction-history">
          <h3>Recent Transactions</h3>
          <TransactionList
            transactions={transactions.slice(0, 5)} // Show only recent 5 transactions
            onDeleteTransaction={onDeleteTransaction}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;