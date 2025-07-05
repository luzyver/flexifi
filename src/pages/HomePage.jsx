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
  showToast,
  categories,
}) => {
  return (
    <div className="container mt-5">
      <h1 className="mb-5 display-4 fw-bold text-center text-primary">Welcome, {username}!</h1>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <Balance 
                income={income}
                expense={expense}
                balance={balance}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                availableMonths={availableMonths}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Add New Transaction</h5>
            </div>
            <div className="card-body">
              <AddTransaction onAddTransaction={onAddTransaction} showToast={showToast} transactions={transactions} categories={categories} />
            </div>
          </div>
        </div>

        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Recent Transactions</h5>
            </div>
            <div className="card-body">
              <TransactionList
                title=""
                transactions={transactions}
                onDeleteTransaction={onDeleteTransaction}
                limit={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
