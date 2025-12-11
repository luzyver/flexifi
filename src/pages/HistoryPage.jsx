import { useState, useMemo, memo } from 'react';
import TransactionList from '../components/transactions/TransactionList';
import Skeleton from '../components/common/Skeleton';
import DateRangeFilter from '../components/common/DateRangeFilter';
import { formatRupiah } from '../utils/formatRupiah';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const StatCard = memo(function StatCard({ title, value, count, icon: Icon, type }) {
  const styles = {
    income: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    expense: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    total: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles[type]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-xl font-bold ${styles[type].split(' ')[0]}`}>
            {type === 'total' ? value : formatRupiah(value)}
          </p>
          {count !== undefined && (
            <p className="text-xs text-slate-400 mt-0.5">{count} transaksi</p>
          )}
        </div>
      </div>
    </div>
  );
});

const HistoryPage = memo(function HistoryPage({ 
  transactions, 
  allTransactions,
  onDeleteTransaction, 
  isLoading,
  setFilterMonth,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'pemasukan');
    const expense = transactions.filter((t) => t.type === 'pengeluaran');
    return {
      incomeTotal: income.reduce((sum, t) => sum + t.amount, 0),
      incomeCount: income.length,
      expenseTotal: expense.reduce((sum, t) => sum + t.amount, 0),
      expenseCount: expense.length,
      total: transactions.length,
    };
  }, [transactions]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const handleFilterChange = (filter) => {
    setCurrentPage(1); // Reset to first page when filter changes
    if (!filter) {
      setFilterMonth('');
    } else if (filter.type === 'singleDate') {
      setFilterMonth(`singleDate-${filter.selectedDate}`);
    } else if (filter.type === 'byYear') {
      setFilterMonth(`byYear-${filter.selectedYear}`);
    } else if (filter.type === 'byMonth') {
      setFilterMonth(`byMonth-${filter.selectedMonth}-${filter.selectedYear}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Riwayat Transaksi
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kelola semua transaksi Anda
            </p>
          </div>
        </div>
        <DateRangeFilter onFilterChange={handleFilterChange} transactions={allTransactions} />
      </div>

      {/* Stats */}
      {!isLoading && transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Pemasukan"
            value={stats.incomeTotal}
            count={stats.incomeCount}
            icon={ArrowUpRight}
            type="income"
          />
          <StatCard
            title="Total Pengeluaran"
            value={stats.expenseTotal}
            count={stats.expenseCount}
            icon={ArrowDownRight}
            type="expense"
          />
          <StatCard
            title="Total Transaksi"
            value={stats.total}
            icon={Wallet}
            type="total"
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Semua Transaksi</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {isLoading ? '...' : `${transactions.length} transaksi`}
            </span>
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <TransactionList
              transactions={currentTransactions}
              onDeleteTransaction={onDeleteTransaction}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Belum ada transaksi
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Transaksi akan muncul di sini
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === num
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default HistoryPage;
