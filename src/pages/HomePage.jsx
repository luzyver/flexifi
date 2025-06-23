// client/src/pages/HomePage.jsx
import React from 'react';
import Balance from '../components/Balance';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';

const HomePage = ({ income, expense, balance, onAddTransaction, transactions, onDeleteTransaction }) => {
  return (
    <>
      <h1>Money Tracker Dashboard</h1> {/* Moved H1 here */}
      <div className="home-page-layout">
        <div className="card balance-card"> {/* Added card class */}
          <h3>Your Balance</h3> {/* Changed H2 to H3 for consistency with card titles */}
          <Balance income={income} expense={expense} balance={balance} />
        </div>
        
        <div className="card add-transaction-form"> {/* Added card class directly to form */}
          <h3>Add New Transaction</h3>
          <AddTransaction onAddTransaction={onAddTransaction} />
        </div>

        {/* Display recent transactions on the home page */}
        <div className="card transaction-history"> {/* Added card class */}
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