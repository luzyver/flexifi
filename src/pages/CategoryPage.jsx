import React, { useState, useEffect, useCallback } from 'react';
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
        onCategoryAdded(); // Refresh the list via prop
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Redirect ke halaman login
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          window.location.href = '/';
        } else {
          showToast(data.error || 'Failed to add category', 'error');
        }
      }
    } catch (error) {
      showToast('Error adding category: ' + error.message, 'error');
    }
  };

  const handleDeleteClick = (id) => {
    onDeleteCategory(id, onCategoryAdded); // Pass onCategoryAdded as a callback
  };

  

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Manage Categories"
        subtitle="Add and organize your transaction categories"
        icon="bi-tags"
      />

      {/* Add Category Form */}
      <div className="card mb-4 fade-in">
        <div className="card-header">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Category
          </h6>
        </div>
        <div className="card-body">
        <form onSubmit={handleAddCategory}>
          <div className="mb-3">
            <label htmlFor="newCategoryName" className="form-label text-muted">Category Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name..."
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newCategoryType" className="form-label text-muted">Category Type</label>
            <select
              className="form-select form-select-lg"
              id="newCategoryType"
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
            >
              <option value="pengeluaran">Pengeluaran</option>
              <option value="pemasukan">Pemasukan</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100">Add Category</button>
        </form>
        </div>
      </div>

      {/* Category List */}
      <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-list-ul me-2"></i>
            Existing Categories
          </h6>
          <span className="badge bg-light text-dark">
            {categories.length} total
          </span>
        </div>
        <div className="card-body p-0">
        {categories.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-tags display-1 text-muted mb-3"></i>
            <h6 className="text-muted mb-2">No categories found</h6>
            <p className="text-muted mb-0 small">Add some categories above to get started.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {categories.map((cat) => (
              <div key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className={`badge ms-2 ${cat.type === 'pemasukan' ? 'bg-success' : 'bg-danger'}`}>
                    {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                  </span>
                  <span className="fw-bold">  {cat.category}</span>
                </div>
                <button
                  onClick={() => handleDeleteClick(cat._id)}
                  className="btn btn-outline-danger btn-sm p-1"
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
  );
};

export default CategoryPage;