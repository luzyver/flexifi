import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import TransactionList from '../components/transactions/TransactionList';
import Skeleton from '../components/common/Skeleton';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import DateRangeFilter from '../components/common/DateRangeFilter';
import { formatRupiah } from '../utils/formatRupiah';

const StatCard = memo(function StatCard({ label, value, icon: Icon, type, isLoading }) {
  const styles = {
    income: {
      icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      value: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      icon: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
      value: 'text-rose-600 dark:text-rose-400',
    },
    balance: {
      icon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
      value: 'text-slate-900 dark:text-white',
    },
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`p-2 rounded-xl ${styles[type].icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-32 rounded-lg" />
      ) : (
        <p className={`text-2xl font-bold ${type === 'balance' && value < 0 ? 'text-rose-600' : styles[type].value}`}>
          {formatRupiah(value)}
        </p>
      )}
    </div>
  );
});

const HomePage = memo(function HomePage({
  income,
  expense,
  balance,
  transactions,
  allTransactions,
  onDeleteTransaction,
  username,
  isLoading,
  setFilterMonth,
}) {
  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const handleFilterChange = (filter) => {
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Halo, {username}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter onFilterChange={handleFilterChange} transactions={allTransactions} />
          <Link 
            to="/add-transaction" 
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pemasukan" value={income} icon={ArrowUpRight} type="income" isLoading={isLoading} />
        <StatCard label="Pengeluaran" value={expense} icon={ArrowDownRight} type="expense" isLoading={isLoading} />
        <StatCard label="Saldo" value={balance} icon={Wallet} type="balance" isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Kategori Pengeluaran</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <CategoryPieChart transactions={transactions} />
          )}
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Tren Bulanan</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <MonthlyTrendChart transactions={transactions} />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Transaksi Terbaru</h3>
          {transactions.length > 5 && (
            <Link 
              to="/history" 
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              Lihat semua 
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={onDeleteTransaction} 
              limit={5} 
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Belum ada transaksi
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Mulai catat transaksi pertama Anda
              </p>
              <Link to="/add-transaction" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Transaksi
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default HomePage;
