import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';

const HistoryPage = ({ transactions, onDeleteTransaction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <h1>Transaction History</h1>
      <div className="history-page-layout">
        <div className="card transaction-history">
          <TransactionList 
            title="All Transactions" 
            transactions={currentTransactions} 
            onDeleteTransaction={onDeleteTransaction} 
          />
          {totalPages > 1 && (
            <div className="pagination">
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="pagination-arrow"
                >
                  &laquo;
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                if (totalPages <= 3 || (number >= currentPage - 1 && number <= currentPage + 1)) {
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? 'active' : ''}
                    >
                      {number}
                    </button>
                  );
                }
                return null;
              })}
              {currentPage < totalPages && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="pagination-arrow"
                >
                  &raquo;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
