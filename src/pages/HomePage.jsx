import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, PieChart, BarChart3, Clock, Plus, Heart } from 'lucide-react';
import TransactionList from '../components/transactions/TransactionList';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import { formatRupiah } from '../utils/formatRupiah';

const HomePage = ({
  income,
  expense,
  balance,
  transactions,
  onDeleteTransaction,
  username,
}) => {
  // Calculate percentage changes (mock data for demo)
  const incomeChange = 12.5;
  const expenseChange = -8.3;
  const balanceChange = balance >= 0 ? 15.2 : -5.7;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Selamat datang kembali, {username}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Berikut ikhtisar keuangan Anda hari ini
            </p>
          </div>
          <div className="hidden md:block mt-4 md:mt-0">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
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
                {formatRupiah(income)}
              </div>
              <div className="flex items-center text-sm text-success-600 dark:text-success-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{incomeChange}% dari bulan lalu
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
                {formatRupiah(expense)}
              </div>
              <div className="flex items-center text-sm text-danger-600 dark:text-danger-400">
                <TrendingDown className="w-4 h-4 mr-1" />
                {expenseChange}% dari bulan lalu
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in md:col-span-2 xl:col-span-1" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Saldo Saat Ini
              </div>
              <div className={`text-2xl lg:text-3xl font-bold mb-2 ${balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {formatRupiah(balance)}
              </div>
              <div className={`flex items-center text-sm ${balanceChange >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {balanceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {balanceChange >= 0 ? '+' : ''}{balanceChange}% dari bulan lalu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribusi Kategori</h3>
            </div>
          </div>
          <div className="p-6">
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tren Bulanan</h3>
            </div>
          </div>
          <div className="p-6">
            <MonthlyTrendChart transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaksi Terbaru</h3>
                </div>
                {transactions.length > 5 && (
                  <Link 
                    to="/history" 
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Lihat Semua
                  </Link>
                )}
              </div>
            </div>
            <div className="p-0">
              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={onDeleteTransaction}
                  limit={5}
                />
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="mb-4">
                    <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada transaksi</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Mulai lacak keuangan Anda hari ini</p>
                  <Link 
                    to="/add-transaction" 
                    className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Transaksi Pertama
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistik Cepat</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Transaksi</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{transactions.length}</div>
                  </div>
                  <div className="text-primary-600 dark:text-primary-400">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Transaksi Pemasukan</div>
                    <div className="text-xl font-bold text-success-600 dark:text-success-400">
                      {transactions.filter(t => t.type === 'pemasukan').length}
                    </div>
                  </div>
                  <div className="text-success-600 dark:text-success-400">
                    <ArrowUpCircle className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Transaksi Pengeluaran</div>
                    <div className="text-xl font-bold text-danger-600 dark:text-danger-400">
                      {transactions.filter(t => t.type === 'pengeluaran').length}
                    </div>
                  </div>
                  <div className="text-danger-600 dark:text-danger-400">
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Health */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kesehatan Keuangan</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className={`text-4xl mb-4 ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {balance >= 0 ? '😊' : '😟'}
                </div>
                <div className={`text-lg font-semibold mb-3 ${balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {balance >= 0 ? 'Sehat' : 'Perlu Perhatian'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {balance >= 0 
                    ? 'Pemasukan Anda melebihi pengeluaran. Pertahankan!'
                    : 'Pengeluaran Anda melebihi pemasukan. Pertimbangkan untuk meninjau pengeluaran Anda.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;