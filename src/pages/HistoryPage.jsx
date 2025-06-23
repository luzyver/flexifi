// client/src/pages/HistoryPage.jsx
import React from 'react';
import TransactionList from '../components/TransactionList';

const HistoryPage = ({ transactions, onDeleteTransaction }) => { // Removed filterMonth, setFilterMonth, availableMonths props
  return (
    <>
      <h1>Transaction History</h1>
      <div className="history-page-layout">
        {/* Filter section removed from here */}
        <div className="card transaction-history full-width-card"> {/* Added full-width-card for styling */}
          <h3>All Transactions</h3>
          <TransactionList transactions={transactions} onDeleteTransaction={onDeleteTransaction} />
        </div>
      </div>
    </>
  );
};

export default HistoryPage;