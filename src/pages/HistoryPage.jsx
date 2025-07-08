import React, { useState, useMemo } from 'react';
import TransactionList from '../components/TransactionList';
import { Accordion, AccordionItem, Card, Badge, Breadcrumb, Pagination } from '../components/auth';

const HistoryPage = ({ transactions, onDeleteTransaction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' atau 'group'
  const transactionsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Mengelompokkan transaksi berdasarkan tanggal
  const groupedTransactions = useMemo(() => {
    const groups = {};
    
    currentTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(transaction);
    });
    
    // Mengurutkan tanggal dari yang terbaru
    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[0].split(' ').reverse().join(' '));
      const dateB = new Date(b[0].split(' ').reverse().join(' '));
      return dateB - dateA;
    });
  }, [currentTransactions]);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll ke atas halaman saat berpindah halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Breadcrumb removed */}
          
          {/* Header */}
          <div className="text-center mb-3 mb-md-4 fade-in">
            <h1 className="display-6 fw-bold text-white mb-2">
              <i className="bi bi-clock-history me-2"></i>
              Riwayat Transaksi
            </h1>
            <p className="lead text-white-50">
              Lihat dan kelola semua transaksi Anda
            </p>
          </div>

          {/* Transaction List Card */}
          <Card 
            className="fade-in" 
            style={{ animationDelay: '0.1s' }}
            header={
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <i className="bi bi-list-ul me-2"></i>
                  <h5 className="mb-0">Semua Transaksi</h5>
                  <Badge 
                    text={`${transactions.length} total`}
                    variant="light"
                    size="sm"
                    className="ms-2 text-dark"
                  />
                </div>
                <div className="btn-group" role="group" aria-label="View mode">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="bi bi-list me-1"></i>
                    Daftar
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'group' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('group')}
                  >
                    <i className="bi bi-collection me-1"></i>
                    Grup
                  </button>
                </div>
              </div>
            }
            bodyClassName="p-0"
          >
            {viewMode === 'list' ? (
              <TransactionList 
                transactions={currentTransactions} 
                onDeleteTransaction={onDeleteTransaction} 
              />
            ) : (
              <Accordion id="transactions-by-date" alwaysOpen={true}>
                {groupedTransactions.map(([date, dateTransactions], index) => (
                  <AccordionItem 
                    key={date}
                    id={`date-${index}`}
                    title={
                      <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                        <span>
                          <i className="bi bi-calendar3 me-2"></i>
                          {date}
                        </span>
                        <Badge 
                          text={`${dateTransactions.length} transaksi`}
                          variant="light"
                          size="sm"
                          className="text-dark"
                        />
                      </div>
                    }
                    defaultOpen={index === 0}
                  >
                    <TransactionList 
                      transactions={dateTransactions} 
                      onDeleteTransaction={onDeleteTransaction} 
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer bg-light">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                  showFirstLast={true}
                  size="md"
                />
              </div>
            )}
          </Card>

          {/* Summary Card */}
          {transactions.length > 0 && (
            <Card 
              className="mt-3 mt-md-4 fade-in" 
              style={{ animationDelay: '0.2s' }}
              header={
                <div className="d-flex align-items-center">
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  <h5 className="mb-0">Ringkasan Transaksi</h5>
                </div>
              }
            >
              <div className="row text-center g-3">
                <div className="col-4">
                  <Card 
                    className="h-100" 
                    variant="success" 
                    outline 
                    hoverable
                  >
                    <div className="text-success py-2">
                      <i className="bi bi-arrow-up-circle-fill fs-4 mb-2"></i>
                      <div className="fw-bold fs-5">
                        {transactions.filter(t => t.type === 'pemasukan').length}
                      </div>
                      <small>Pemasukan</small>
                    </div>
                  </Card>
                </div>
                <div className="col-4">
                  <Card 
                    className="h-100" 
                    variant="danger" 
                    outline 
                    hoverable
                  >
                    <div className="text-danger py-2">
                      <i className="bi bi-arrow-down-circle-fill fs-4 mb-2"></i>
                      <div className="fw-bold fs-5">
                        {transactions.filter(t => t.type === 'pengeluaran').length}
                      </div>
                      <small>Pengeluaran</small>
                    </div>
                  </Card>
                </div>
                <div className="col-4">
                  <Card 
                    className="h-100" 
                    variant="primary" 
                    outline 
                    hoverable
                  >
                    <div className="text-primary py-2">
                      <i className="bi bi-list-check fs-4 mb-2"></i>
                      <div className="fw-bold fs-5">{transactions.length}</div>
                      <small>Total</small>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;