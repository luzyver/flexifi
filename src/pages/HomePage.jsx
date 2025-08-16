import { Link } from 'react-router-dom';
import TransactionList from '../components/transactions/TransactionList';
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

      {/* Financial Insights */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-lg-8">
          {/* Recent Transactions */}
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock-history me-2"></i>
                  <h6 className="mb-0 fw-semibold">Transaksi Terbaru</h6>
                </div>
                {transactions.length > 5 && (
                  <Link to="/history" className="modern-btn modern-btn-outline modern-btn-sm">
                    Lihat Semua
                  </Link>
                )}
              </div>
            </div>
            <div className="dashboard-card-body p-0">
              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={onDeleteTransaction}
                  limit={5}
                />
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-wallet2 display-1 text-muted"></i>
                  </div>
                  <h6 className="text-muted mb-2">Belum ada transaksi</h6>
                  <p className="text-muted small mb-3">Mulai lacak keuangan Anda hari ini</p>
                  <Link to="/add-transaction" className="modern-btn modern-btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Tambah Transaksi Pertama
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-12 col-lg-4">
          {/* Quick Stats */}
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-graph-up me-2"></i>
                <h6 className="mb-0 fw-semibold">Statistik Cepat</h6>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                    <div>
                      <div className="text-muted small">Total Transaksi</div>
                      <div className="fw-bold">{transactions.length}</div>
                    </div>
                    <div className="text-primary">
                      <i className="bi bi-list-check fs-4"></i>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                    <div>
                      <div className="text-muted small">Transaksi Pemasukan</div>
                      <div className="fw-bold text-success">
                        {transactions.filter(t => t.type === 'pemasukan').length}
                      </div>
                    </div>
                    <div className="text-success">
                      <i className="bi bi-arrow-up-circle fs-4"></i>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                    <div>
                      <div className="text-muted small">Transaksi Pengeluaran</div>
                      <div className="fw-bold text-danger">
                        {transactions.filter(t => t.type === 'pengeluaran').length}
                      </div>
                    </div>
                    <div className="text-danger">
                      <i className="bi bi-arrow-down-circle fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Health */}
          <div className="dashboard-card mt-3 fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-heart-pulse me-2"></i>
                <h6 className="mb-0 fw-semibold">Kesehatan Keuangan</h6>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="text-center">
                <div className={`display-6 fw-bold mb-2 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  {balance >= 0 ? '😊' : '😟'}
                </div>
                <div className={`fw-semibold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  {balance >= 0 ? 'Sehat' : 'Perlu Perhatian'}
                </div>
                <p className="text-muted small mb-0 mt-2">
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