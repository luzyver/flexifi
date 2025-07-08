import React from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import { LinkButton, Card, Breadcrumb } from '../components/auth';

const HomePage = ({
  income,
  expense,
  balance,
  transactions,
  onDeleteTransaction,
  username,
}) => {
  return (
    <div className="container-fluid">
      {/* Breadcrumb removed */}

      {/* Welcome Section */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="welcome-banner animate-fade-in">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Selamat datang kembali, <span className="highlight">{username}</span>! <span className="wave-emoji">👋</span>
              </h1>
              <p className="welcome-subtitle">
                Kelola keuangan Anda dan capai tujuan finansial Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        <div className="col-6 col-lg-4">
          <div className="stats-card animate-fade-in hover-lift">
            <div className="stats-card-icon bg-success-light">
              <i className="bi bi-arrow-down-circle-fill text-success"></i>
            </div>
            <div className="stats-card-content">
              <div className="stats-card-title">Total Pemasukan</div>
              <div className="stats-card-value text-success">
                Rp {income.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-4">
          <div className="stats-card animate-fade-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="stats-card-icon bg-danger-light">
              <i className="bi bi-arrow-up-circle-fill text-danger"></i>
            </div>
            <div className="stats-card-content">
              <div className="stats-card-title">Total Pengeluaran</div>
              <div className="stats-card-value text-danger">
                Rp {expense.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="stats-card animate-fade-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className={`stats-card-icon ${balance >= 0 ? 'bg-success-light' : 'bg-danger-light'}`}>
              <i className={`bi bi-wallet2 ${balance >= 0 ? 'text-success' : 'text-danger'}`}></i>
            </div>
            <div className="stats-card-content">
              <div className="stats-card-title">Saldo Bersih</div>
              <div className={`stats-card-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                Rp {balance.toLocaleString('id-ID')}
              </div>
              {balance >= 0 ? 
                <div className="stats-card-change positive">Keuangan Anda dalam kondisi baik</div> :
                <div className="stats-card-change negative">Pengeluaran melebihi pemasukan</div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-3 g-md-4">
      </div>

      {/* Recent Transactions */}
      <div className="row mt-3 mt-md-4">
        <div className="col-12">
          <Card 
            className="animate-fade-in" 
            style={{ animationDelay: '0.3s' }}
            header={
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100">
                <h5 className="mb-2 mb-md-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Transaksi Terbaru
                </h5>
                <LinkButton
                  to="/history"
                  text="Lihat Semua"
                  icon="bi bi-arrow-right"
                  variant="outline-primary"
                  size="sm"
                  className="hover-scale"
                />
              </div>
            }
            bodyClassName="p-0"
          >
              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={onDeleteTransaction}
                  limit={5}
                />
              ) : (
                <div className="text-center py-4 py-md-5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <i className="bi bi-inbox display-1 text-muted mb-3 animate-pulse"></i>
                  <h5 className="text-muted mb-2">Belum ada transaksi</h5>
                  <p className="text-muted mb-3 small">Mulai dengan menambahkan transaksi pertama Anda</p>
                  <LinkButton
                    to="/add-transaction"
                    text="Tambah Transaksi Pertama"
                    icon="bi bi-plus-circle-fill"
                    variant="primary"
                    className="hover-lift"
                  />
                </div>
              )}
             </Card>
           </div>
      </div>
    </div>
  );
};

export default HomePage;