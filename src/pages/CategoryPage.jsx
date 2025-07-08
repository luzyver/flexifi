import React, { useState, useEffect, useCallback } from 'react';

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
      <h2 className="mb-4 display-5 fw-bold text-center text-primary">Manage Categories</h2>

      {/* Add Category Form */}
      <div className="card p-4 mb-4 shadow-lg border-0 rounded-3">
        <h5 className="card-title mb-4 text-primary fw-bold">Add New Category</h5>
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

      {/* Category List */}
      <div className="card p-4 shadow-lg border-0 rounded-3">
        <h5 className="card-title mb-4 text-primary fw-bold">Existing Categories</h5>
        {categories.length === 0 ? (
          <p className="text-center text-muted">No categories found. Add some above!</p>
        ) : (
          <ul className="list-group list-group-flush">
            {categories.map((cat) => (
              <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;