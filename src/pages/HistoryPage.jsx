import { useState } from 'react';
import TransactionList from '../components/TransactionList';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';
import { formatRupiah } from '../utils/formatRupiah';

const HistoryPage = ({ transactions, onDeleteTransaction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate totals for current page
  const currentPageIncome = currentTransactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentPageExpense = currentTransactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

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
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <PageHeader
            title="Riwayat Transaksi"
            subtitle="Lihat dan kelola semua transaksi keuangan Anda"
            icon="bi-clock-history"
          />

          {/* Summary Cards */}
          {transactions.length > 0 && (
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="modern-stats-card income fade-in">
                  <div className="stats-icon income">
                    <i className="bi bi-arrow-up-circle-fill"></i>
                  </div>
                  <div className="stats-label">Total Pemasukan</div>
                  <div className="stats-value text-success">
                    {formatRupiah(transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0))}
                  </div>
                  <div className="stats-change positive">
                    <i className="bi bi-list-check"></i>
                    {transactions.filter(t => t.type === 'pemasukan').length} transaksi
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="modern-stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="stats-icon expense">
                    <i className="bi bi-arrow-down-circle-fill"></i>
                  </div>
                  <div className="stats-label">Total Pengeluaran</div>
                  <div className="stats-value text-danger">
                    {formatRupiah(transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0))}
                  </div>
                  <div className="stats-change negative">
                    <i className="bi bi-list-check"></i>
                    {transactions.filter(t => t.type === 'pengeluaran').length} transaksi
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="modern-stats-card balance fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="stats-icon balance">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div className="stats-label">Total Transaksi</div>
                  <div className="stats-value text-primary">
                    {transactions.length}
                  </div>
                  <div className="stats-change positive">
                    <i className="bi bi-calendar-range"></i>
                    Catatan sepanjang waktu
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction List Card */}
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <i className="bi bi-list-ul me-2"></i>
                  <h6 className="mb-0 fw-semibold">Semua Transaksi</h6>
                </div>
                <div className="d-flex align-items-center gap-3">
                  {currentTransactions.length > 0 && (
                    <div className="d-none d-md-flex align-items-center gap-3 text-muted small">
                      <span className="d-flex align-items-center">
                        <i className="bi bi-arrow-up-circle text-success me-1"></i>
                        {formatRupiah(currentPageIncome)}
                      </span>
                      <span className="d-flex align-items-center">
                        <i className="bi bi-arrow-down-circle text-danger me-1"></i>
                        {formatRupiah(currentPageExpense)}
                      </span>
                    </div>
                  )}
                  <span className="modern-badge light">
                    {transactions.length} transaksi
                  </span>
                </div>
              </div>
            </div>
            <div className="dashboard-card-body p-0">
              <TransactionList 
                transactions={currentTransactions} 
                onDeleteTransaction={onDeleteTransaction} 
              />
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="dashboard-card-header border-top">
                <nav aria-label="Transaction pagination" className="w-100">
                  <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link border-0 bg-transparent" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                        <span className="d-none d-sm-inline ms-1">Sebelumnya</span>
                      </button>
                    </li>
                    {paginationNumbers.map((number, index) => (
                      number === '...' ? (
                        <li key={`ellipsis-${index}`} className="page-item disabled">
                          <span className="page-link border-0 bg-transparent">...</span>
                        </li>
                      ) : (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                          <button 
                            onClick={() => paginate(number)} 
                            className={`page-link border-0 ${currentPage === number ? 'bg-primary text-white' : 'bg-transparent'}`}
                          >
                            {number}
                          </button>
                        </li>
                      )
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link border-0 bg-transparent" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="d-none d-sm-inline me-1">Berikutnya</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;