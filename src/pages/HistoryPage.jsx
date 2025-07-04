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

  const getPaginationNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const maxVisiblePages = 3; // Only show 3 consecutive pages

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = currentPage - 1;
      let endPage = currentPage + 1;

      // Adjust startPage and endPage to ensure 3 pages are always shown if possible
      if (startPage < 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const paginationNumbers = getPaginationNumbers(currentPage, totalPages);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 display-4 fw-bold text-center text-primary">Transaction History</h1>
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-body">
          <TransactionList 
            title="All Transactions" 
            transactions={currentTransactions} 
            onDeleteTransaction={onDeleteTransaction} 
          />
          {totalPages > 1 && (
            <nav aria-label="Page navigation example" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    <i className="bi bi-arrow-left"></i>
                  </button>
                </li>
                {paginationNumbers.map((number, index) => (
                  number === '...' ? (
                    <li key={`ellipsis-${index}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  ) : (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <button onClick={() => paginate(number)} className="page-link">
                        {number}
                      </button>
                    </li>
                  )
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
