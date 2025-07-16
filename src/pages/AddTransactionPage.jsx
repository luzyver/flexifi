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
            title="Add Transaction"
            subtitle="Record your income or expense"
            icon="bi-plus-circle"
          />

          {/* Add Transaction Form */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-wallet2 me-2"></i>
                Transaction Details
              </h6>
            </div>
            <div className="card-body">
              <AddTransaction 
                onAddTransaction={onAddTransaction}
                showToast={showToast}
                transactions={transactions}
                categories={categories}
              />
            </div>
          </div>

          {/* Quick Tips */}
          <div className="card mt-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body">
              <h6 className="card-title fw-semibold mb-3">
                <i className="bi bi-lightbulb me-2"></i>
                Tips
              </h6>
              <ul className="list-unstyled mb-0 small text-muted">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Use descriptive names for easy tracking
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Choose the correct category for better insights
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Double-check the amount before saving
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;