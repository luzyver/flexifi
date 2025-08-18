import { useState } from 'react';
import Skeleton from '../components/common/Skeleton';
import TransactionList from '../components/transactions/TransactionList';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import { formatRupiah } from '../utils/formatRupiah';
import { ArrowUpCircle, ArrowDownCircle, Wallet, List, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const HistoryPage = ({ transactions, onDeleteTransaction, isLoading }) => {
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Riwayat Transaksi"
        subtitle="Lihat dan kelola semua transaksi keuangan Anda"
        icon="clock-history"
      />

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {[0,1,2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 animate-fade-in">
              <Skeleton className="h-6 w-32 mb-4 rounded" />
              <Skeleton className="h-8 w-40 mb-2 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                    <ArrowUpCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Pemasukan
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                  {formatRupiah(transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0))}
                </div>
                <div className="flex items-center text-sm text-success-600 dark:text-success-400">
                  <List className="w-4 h-4 mr-1" />
                  {transactions.filter(t => t.type === 'pemasukan').length} transaksi
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-xl flex items-center justify-center">
                    <ArrowDownCircle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Pengeluaran
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-danger-600 dark:text-danger-400 mb-2">
                  {formatRupiah(transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0))}
                </div>
                <div className="flex items-center text-sm text-danger-600 dark:text-danger-400">
                  <List className="w-4 h-4 mr-1" />
                  {transactions.filter(t => t.type === 'pengeluaran').length} transaksi
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Transaksi
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {transactions.length}
                </div>
                <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  Catatan sepanjang waktu
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <List className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semua Transaksi</h3>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoading && currentTransactions.length > 0 && (
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <ArrowUpCircle className="w-4 h-4 text-success-600 mr-1" />
                    {formatRupiah(currentPageIncome)}
                  </span>
                  <span className="flex items-center">
                    <ArrowDownCircle className="w-4 h-4 text-danger-600 mr-1" />
                    {formatRupiah(currentPageExpense)}
                  </span>
                </div>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {isLoading ? '...' : `${transactions.length} transaksi`}
              </span>
            </div>
          </div>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-56 mb-2 rounded" />
                        <Skeleton className="h-3 w-28 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TransactionList 
              transactions={currentTransactions} 
              onDeleteTransaction={onDeleteTransaction} 
            />
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <nav aria-label="Transaction pagination" className="flex justify-center">
              <div className="flex items-center space-x-2">
                <button 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {paginationNumbers.map((number, index) => (
                    number === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button 
                        key={number}
                        onClick={() => paginate(number)} 
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === number 
                            ? 'bg-primary-600 text-white' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {number}
                      </button>
                    )
                  ))}
                </div>
                
                <button 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === totalPages 
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1">Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
