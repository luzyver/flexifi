import { Link } from 'react-router-dom';
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
    <div className="container-fluid">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="h3 fw-bold text-primary mb-1 fade-in">
                Selamat datang kembali, {username}! 👋
              </h1>
              <p className="text-muted mb-0 fade-in" style={{ animationDelay: '0.1s' }}>
                Berikut ikhtisar keuangan Anda hari ini
              </p>
            </div>
            <div className="d-none d-md-block fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-end">
                <div className="text-muted small">
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
      </div>

      {/* Stats Overview - Modern Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-stats-card income fade-in">
            <div className="stats-icon income">
              <i className="bi bi-arrow-up-circle-fill"></i>
            </div>
            <div className="stats-label">Total Pemasukan</div>
            <div className="stats-value text-success">
              {formatRupiah(income)}
            </div>
            <div className="stats-change positive">
              <i className="bi bi-arrow-up"></i>
              +{incomeChange}% dari bulan lalu
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-xl-4">
          <div className="modern-stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stats-icon expense">
              <i className="bi bi-arrow-down-circle-fill"></i>
            </div>
            <div className="stats-label">Total Pengeluaran</div>
            <div className="stats-value text-danger">
              {formatRupiah(expense)}
            </div>
            <div className="stats-change negative">
              <i className="bi bi-arrow-down"></i>
              {expenseChange}% dari bulan lalu
            </div>
          </div>
        </div>
        
        <div className="col-12 col-xl-4">
          <div className="modern-stats-card balance fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="stats-icon balance">
              <i className="bi bi-wallet2"></i>
            </div>
            <div className="stats-label">Saldo Saat Ini</div>
            <div className={`stats-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatRupiah(balance)}
            </div>
            <div className={`stats-change ${balanceChange >= 0 ? 'positive' : 'negative'}`}>
              <i className={`bi ${balanceChange >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
              {balanceChange >= 0 ? '+' : ''}{balanceChange}% dari bulan lalu
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Distribusi Kategori</h2>
          <CategoryPieChart transactions={transactions} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Tren Bulanan</h2>
          <MonthlyTrendChart transactions={transactions} />
        </div>
      </div>

      {/* Latest Transactions and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
              {transactions.length > 5 && (
                <Link to="/history" className="text-sm text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              )}
            </div>
            {transactions.length > 0 ? (
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={onDeleteTransaction}
                limit={5}
              />
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Belum ada transaksi</p>
                <Link
                  to="/add-transaction"
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  Tambah Transaksi Pertama
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-xl font-semibold">{transactions.length}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Transaksi Pemasukan</p>
            <p className="text-xl font-semibold text-green-600">
              {transactions.filter(t => t.type === 'pemasukan').length}
            </p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Transaksi Pengeluaran</p>
            <p className="text-xl font-semibold text-red-600">
              {transactions.filter(t => t.type === 'pengeluaran').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
