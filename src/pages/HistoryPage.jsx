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
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = currentPage - 1;
      let endPage = currentPage + 1;

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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Header */}
          <div className="text-center mb-3 mb-md-4 fade-in">
            <h1 className="display-6 fw-bold text-white mb-2">
              <i className="bi bi-clock-history me-2"></i>
              Transaction History
            </h1>
            <p className="lead text-white-50">
              View and manage all your transactions
            </p>
          </div>

          {/* Transaction List Card */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <h5 className="mb-2 mb-md-0">
                <i className="bi bi-list-ul me-2"></i>
                All Transactions
              </h5>
              <span className="badge bg-light text-dark">
                {transactions.length} total
              </span>
            </div>
            <div className="card-body p-0">
              <TransactionList 
                transactions={currentTransactions} 
                onDeleteTransaction={onDeleteTransaction} 
              />
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer bg-light">
                <nav aria-label="Transaction pagination">
                  <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                        <span className="d-none d-sm-inline ms-1">Previous</span>
                      </button>
                    </li>
                    {paginationNumbers.map((number, index) => (
                      number === '...' ? (
                        <li key={`ellipsis-${index}`} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      ) : (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                          <button 
                            onClick={() => paginate(number)} 
                            className="page-link"
                          >
                            {number}
                          </button>
                        </li>
                      )
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="d-none d-sm-inline me-1">Next</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>

          {/* Summary Card */}
          {transactions.length > 0 && (
            <div className="card mt-3 mt-md-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="text-success">
                      <i className="bi bi-arrow-up-circle-fill fs-4 mb-2"></i>
                      <div className="fw-bold">
                        {transactions.filter(t => t.type === 'pemasukan').length}
                      </div>
                      <small className="text-muted">Income</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-danger">
                      <i className="bi bi-arrow-down-circle-fill fs-4 mb-2"></i>
                      <div className="fw-bold">
                        {transactions.filter(t => t.type === 'pengeluaran').length}
                      </div>
                      <small className="text-muted">Expense</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-primary">
                      <i className="bi bi-list-check fs-4 mb-2"></i>
                      <div className="fw-bold">{transactions.length}</div>
                      <small className="text-muted">Total</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;