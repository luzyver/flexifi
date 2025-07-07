import React from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/TransactionList';

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
      {/* Welcome Section */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="text-center fade-in">
            <h1 className="display-6 fw-bold text-white mb-2">
              Welcome back, {username}! 👋
            </h1>
            <p className="lead text-white-50 mb-0">
              Track your finances and achieve your goals
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        <div className="col-6 col-lg-4">
          <div className="stats-card fade-in">
            <div className="stats-value text-success">
              Rp {income.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Total Income</div>
          </div>
        </div>
        <div className="col-6 col-lg-4">
          <div className="stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stats-value text-danger">
              Rp {expense.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Total Expense</div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="stats-card income fade-in" style={{ animationDelay: '0.2s' }}>
            <div className={`stats-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              Rp {balance.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Net Balance</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-3 g-md-4">
      </div>

      {/* Recent Transactions */}
      <div className="row mt-3 mt-md-4">
        <div className="col-12">
          <div className="card fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <h5 className="mb-2 mb-md-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Transactions
              </h5>
              <Link to="/history" className="btn btn-sm btn-outline-light">
                <i className="bi bi-arrow-right me-1"></i>
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={onDeleteTransaction}
                  limit={5}
                />
              ) : (
                <div className="text-center py-4 py-md-5">
                  <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 className="text-muted mb-2">No transactions yet</h5>
                  <p className="text-muted mb-3 small">Start by adding your first transaction</p>
                  <Link to="/add-transaction" className="btn btn-primary">
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Add Your First Transaction
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