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
}) => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4 display-4 fw-bold text-center text-primary">Welcome, {username}!</h1>
      <div className="row">
        <div className="col-md-12 mb-4">
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

      <div className="row">
        <div className="col-md-6 mb-4">
          <AddTransaction onAddTransaction={onAddTransaction} showToast={showToast} transactions={transactions} />
        </div>

        <div className="col-md-6 mb-4">
          <TransactionList
            title="Recent Transactions"
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
            limit={5}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
