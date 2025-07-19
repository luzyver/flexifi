import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import PageHeader from '../components/PageHeader';

const CategoryPage = ({ showToast, onDeleteCategory, categories, onCategoryAdded }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('pengeluaran');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Category name cannot be empty', 'error');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: newCategoryType, category: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Category added successfully!', 'success');
        setNewCategoryName('');
        onCategoryAdded();
      } else {
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          window.location.href = '/';
        } else {
          showToast(data.error || 'Failed to add category', 'error');
        }
      }
    } catch (error) {
      showToast('Error adding category: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    onDeleteCategory(id, onCategoryAdded);
  };

  const incomeCategories = categories.filter(cat => cat.type === 'pemasukan');
  const expenseCategories = categories.filter(cat => cat.type === 'pengeluaran');

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Manage Categories"
        subtitle="Organize your transaction categories for better financial tracking"
        icon="bi-tags"
      />

      {/* Stats Overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="modern-stats-card income fade-in">
            <div className="stats-icon income">
              <i className="bi bi-arrow-up-circle-fill"></i>
            </div>
            <div className="stats-label">Income Categories</div>
            <div className="stats-value text-success">
              {incomeCategories.length}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="modern-stats-card expense fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stats-icon expense">
              <i className="bi bi-arrow-down-circle-fill"></i>
            </div>
            <div className="stats-label">Expense Categories</div>
            <div className="stats-value text-danger">
              {expenseCategories.length}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="modern-stats-card balance fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="stats-icon balance">
              <i className="bi bi-tags"></i>
            </div>
            <div className="stats-label">Total Categories</div>
            <div className="stats-value text-primary">
              {categories.length}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Add Category Form */}
        <div className="col-12 col-lg-5">
          <div className="dashboard-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="dashboard-card-header">
              <div className="d-flex align-items-center">
                <i className="bi bi-plus-circle me-2"></i>
                <h6 className="mb-0 fw-semibold">Add New Category</h6>
              </div>
            </div>
            <div className="dashboard-card-body">
              <form onSubmit={handleAddCategory}>
                <div className="modern-form-group">
                  <label htmlFor="newCategoryName" className="modern-form-label">
                    <i className="bi bi-tag"></i>
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="modern-form-control"
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="modern-form-group">
                  <label htmlFor="newCategoryType" className="modern-form-label">
                    <i className="bi bi-arrow-up-down"></i>
                    Category Type
                  </label>
                  <select
                    className="modern-form-select"
                    id="newCategoryType"
                    value={newCategoryType}
                    onChange={(e) => setNewCategoryType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="pengeluaran">💸 Expense (Pengeluaran)</option>
                    <option value="pemasukan">💰 Income (Pemasukan)</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="modern-btn modern-btn-primary w-100"
                  disabled={loading || !newCategoryName.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Category
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Category Lists */}
        <div className="col-12 col-lg-7">
          <div className="row g-4">
            {/* Income Categories */}
            <div className="col-12">
              <div className="dashboard-card fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="dashboard-card-header">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-up-circle-fill text-success me-2"></i>
                      <h6 className="mb-0 fw-semibold">Income Categories</h6>
                    </div>
                    <span className="modern-badge success">
                      {incomeCategories.length}
                    </span>
                  </div>
                </div>
                <div className="dashboard-card-body p-0">
                  {incomeCategories.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-arrow-up-circle display-4 text-muted mb-3"></i>
                      <h6 className="text-muted mb-2">No income categories</h6>
                      <p className="text-muted mb-0 small">Add some income categories to get started.</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {incomeCategories.map((cat) => (
                        <div key={cat._id} className="list-group-item d-flex justify-content-between align-items-center border-0">
                          <div className="d-flex align-items-center">
                            <div className="stats-icon income me-3" style={{ width: '2rem', height: '2rem', fontSize: '0.875rem' }}>
                              <i className="bi bi-tag-fill"></i>
                            </div>
                            <span className="fw-semibold">{cat.category}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(cat._id)}
                            className="modern-btn modern-btn-outline modern-btn-sm text-danger border-danger"
                            aria-label="Delete category"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div className="col-12">
              <div className="dashboard-card fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="dashboard-card-header">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-down-circle-fill text-danger me-2"></i>
                      <h6 className="mb-0 fw-semibold">Expense Categories</h6>
                    </div>
                    <span className="modern-badge danger">
                      {expenseCategories.length}
                    </span>
                  </div>
                </div>
                <div className="dashboard-card-body p-0">
                  {expenseCategories.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-arrow-down-circle display-4 text-muted mb-3"></i>
                      <h6 className="text-muted mb-2">No expense categories</h6>
                      <p className="text-muted mb-0 small">Add some expense categories to get started.</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {expenseCategories.map((cat) => (
                        <div key={cat._id} className="list-group-item d-flex justify-content-between align-items-center border-0">
                          <div className="d-flex align-items-center">
                            <div className="stats-icon expense me-3" style={{ width: '2rem', height: '2rem', fontSize: '0.875rem' }}>
                              <i className="bi bi-tag-fill"></i>
                            </div>
                            <span className="fw-semibold">{cat.category}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(cat._id)}
                            className="modern-btn modern-btn-outline modern-btn-sm text-danger border-danger"
                            aria-label="Delete category"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;