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
  filterMonth,
  setFilterMonth,
  availableMonths,
  username,
}) => {
  return (
    <>
      <h1>Hello, {username}!</h1>
      <div className="home-page-layout">
        <div className="card filter-section">
          <h3>Filter Transactions</h3>
          <div className="form-control">
            <label htmlFor="filterMonth">Select Month:</label>
            <select
              id="filterMonth"
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

        <div className="card balance-card">
          <Balance income={income} expense={expense} balance={balance} />
        </div>

        <div className="card add-transaction-form">
          <h3>Add New Transaction</h3>
          <AddTransaction onAddTransaction={onAddTransaction} />
        </div>

        <div className="card transaction-history">
          <TransactionList
            title="Recent Transactions"
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
            limit={5}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
