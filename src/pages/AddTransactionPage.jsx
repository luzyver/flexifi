import AddTransaction from '../components/transactions/AddTransaction';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';

const AddTransactionPage = ({ 
  onAddTransaction, 
  showToast, 
  transactions, 
  categories 
}) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <PageHeader
            title="Tambah Transaksi Baru"
            subtitle="Catat transaksi pemasukan atau pengeluaran Anda"
            icon="bi-plus-circle"
          />

          {/* Add Transaction Form */}
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-wallet2 me-2"></i>
                <h6 className="mb-0 fw-semibold">Detail Transaksi</h6>
              </div>
            </div>
            <div className="dashboard-card-body">
              <AddTransaction 
                onAddTransaction={onAddTransaction}
                showToast={showToast}
                transactions={transactions}
                categories={categories}
              />
            </div>
          </div>

          {/* Quick Tips */}
          <div className="dashboard-card mt-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-lightbulb me-2"></i>
                <h6 className="mb-0 fw-semibold">Tips Pro</h6>
              </div>
            </div>
            <div className="dashboard-card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon income me-3">
                      <i className="bi bi-check-circle"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Buat Deskripsi Jelas</h6>
                      <p className="text-muted small mb-0">Gunakan nama yang jelas dan deskriptif untuk pelacakan dan kategorisasi yang mudah.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon balance me-3">
                      <i className="bi bi-tags"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Pilih Kategori</h6>
                      <p className="text-muted small mb-0">Pilih kategori yang tepat untuk wawasan dan laporan keuangan yang lebih baik.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon expense me-3">
                      <i className="bi bi-calculator"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Periksa Ulang</h6>
                      <p className="text-muted small mb-0">Verifikasi jumlah dan tanggal sebelum menyimpan untuk menjaga catatan yang akurat.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon income me-3">
                      <i className="bi bi-clock"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Tetap Konsisten</h6>
                      <p className="text-muted small mb-0">Catat transaksi secara teratur untuk gambaran keuangan yang paling akurat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;