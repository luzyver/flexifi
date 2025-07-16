import React from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';

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
      {/* Breadcrumb */}
      <div className="row mb-4">
        <div className="col-12">
          <Breadcrumb />
        </div>
      </div>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <PageHeader
            title={`Hello, ${username}`}
            subtitle="Your financial overview"
            icon="bi-person-circle"
          />
        </div>
      </div>

      {/* Stats Overview - Clean Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-4">
          <div className="stats-card income fade-in">
            <div className="stats-value text-success">
              Rp {income.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Income</div>
          </div>
        </div>
        <div className="col-6 col-lg-4">
          <div className="stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stats-value text-danger">
              Rp {expense.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Expense</div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="stats-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className={`stats-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              Rp {balance.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Balance</div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Minimalist */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-body text-center py-3">
              <div className="row g-2">
                <div className="col-6">
                  <Link to="/add-transaction" className="btn btn-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Transaction
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/history" className="btn btn-outline-secondary w-100">
                    <i className="bi bi-clock-history me-2"></i>
                    View History
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row">
        <div className="col-12">
          <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">Recent Transactions</h6>
              {transactions.length > 5 && (
                <Link to="/history" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              )}
            </div>
            <div className="card-body p-0">
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
                  <h6 className="text-muted mb-2">No transactions yet</h6>
                  <p className="text-muted small mb-3">Start tracking your finances</p>
                  <Link to="/add-transaction" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add First Transaction
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;