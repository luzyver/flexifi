import React from 'react';
import AddTransaction from '../components/AddTransaction';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';

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
            title="Add New Transaction"
            subtitle="Record your income or expense transaction"
            icon="bi-plus-circle"
          />

          {/* Add Transaction Form */}
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-wallet2 me-2"></i>
                <h6 className="mb-0 fw-semibold">Transaction Details</h6>
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
                <h6 className="mb-0 fw-semibold">Pro Tips</h6>
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
                      <h6 className="fw-semibold mb-1">Be Descriptive</h6>
                      <p className="text-muted small mb-0">Use clear, descriptive names for easy tracking and categorization.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon balance me-3">
                      <i className="bi bi-tags"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Choose Categories</h6>
                      <p className="text-muted small mb-0">Select the right category for better financial insights and reports.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon expense me-3">
                      <i className="bi bi-calculator"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Double Check</h6>
                      <p className="text-muted small mb-0">Verify the amount and date before saving to maintain accurate records.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="stats-icon income me-3">
                      <i className="bi bi-clock"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold mb-1">Stay Consistent</h6>
                      <p className="text-muted small mb-0">Record transactions regularly for the most accurate financial picture.</p>
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