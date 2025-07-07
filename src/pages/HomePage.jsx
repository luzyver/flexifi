import React from 'react';
import { Link } from 'react-router-dom';
import Balance from '../components/Balance';
import TransactionList from '../components/TransactionList';

const HomePage = ({
  income,
  expense,
  balance,
  transactions,
  onDeleteTransaction,
  filterMonth,
  setFilterMonth,
  availableMonths,
  username,
}) => {
  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center fade-in">
            <h1 className="display-5 fw-bold text-white mb-2">
              Welcome back, {username}! 👋
            </h1>
            <p className="lead text-white-50 mb-4">
              Track your finances and achieve your goals
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-5">
        <div className="col-lg-4 col-md-6">
          <div className="stats-card fade-in">
            <div className="stats-value text-primary">{income.toLocaleString('id-ID')}</div>
            <div className="stats-label">Total Income</div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stats-value text-danger">{expense.toLocaleString('id-ID')}</div>
            <div className="stats-label">Total Expense</div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="stats-card income fade-in" style={{ animationDelay: '0.2s' }}>
            <div className={`stats-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {balance.toLocaleString('id-ID')}
            </div>
            <div className="stats-label">Net Balance</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Balance Card */}
        <div className="col-lg-8">
          <div className="card balance-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-body">
              <Balance 
                income={income}
                expense={expense}
                balance={balance}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                availableMonths={availableMonths}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <Link to="/add-transaction" className="btn btn-primary btn-lg">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Add Transaction
                </Link>
                <Link to="/history" className="btn btn-outline-primary">
                  <i className="bi bi-clock-history me-2"></i>
                  View History
                </Link>
                <Link to="/categories" className="btn btn-outline-secondary">
                  <i className="bi bi-tags-fill me-2"></i>
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Transactions
              </h5>
              <Link to="/history" className="btn btn-sm btn-outline-light">
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
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No transactions yet</h5>
                  <p className="text-muted mb-4">Start by adding your first transaction</p>
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