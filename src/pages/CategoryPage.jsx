import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, FormInput, FormSelect, IconButton, SubmitButton, Breadcrumb } from '../components/auth';
import { fetchAPI } from '../App';

const CategoryPage = ({ showToast, onDeleteCategory, categories, onCategoryAdded }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('pengeluaran');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Nama kategori tidak boleh kosong', 'error');
      return;
    }

    try {
      setLoading(true);
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/categories`,
        {
          method: 'POST',
          body: JSON.stringify({ type: newCategoryType, category: newCategoryName.trim() }),
        }
      );
      
      if (response.ok && data.success) {
        showToast('Kategori berhasil ditambahkan!', 'success');
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
          showToast(data.error || 'Gagal menambahkan kategori', 'error');
        }
      }
    } catch (error) {
      showToast('Error menambahkan kategori: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    onDeleteCategory(id, onCategoryAdded); // Pass onCategoryAdded as a callback
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb removed */}
      
      <h2 className="mb-4 display-5 fw-bold text-center text-primary">Kelola Kategori</h2>

      {/* Add Category Form */}
      <Card 
        className="mb-4 fade-in" 
        title="Tambah Kategori Baru"
        titleClassName="text-primary fw-bold"
      >
        <form onSubmit={handleAddCategory}>
          <FormInput
            id="newCategoryName"
            label="Nama Kategori"
            icon="bi bi-tag-fill"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Masukkan nama kategori baru..."
            required
            size="lg"
          />
          
          <FormSelect
            id="newCategoryType"
            label="Jenis Kategori"
            icon="bi bi-list-check"
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value)}
            size="lg"
            options={[
              { value: 'pengeluaran', label: 'Pengeluaran' },
              { value: 'pemasukan', label: 'Pemasukan' }
            ]}
          />
          
          <SubmitButton
            text="Tambah Kategori"
            icon="bi bi-plus-circle-fill"
            variant="primary"
            size="lg"
            className="w-100"
            isLoading={loading}
            loadingText="Menambahkan..."
          />
        </form>
      </Card>

      {/* Category List */}
      <Card 
        className="fade-in" 
        style={{ animationDelay: '0.1s' }}
        title="Kategori yang Ada"
        titleClassName="text-primary fw-bold"
      >
        {categories.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-tag display-4 text-muted mb-3"></i>
            <p className="text-muted mb-0">Tidak ada kategori. Tambahkan kategori baru di atas!</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {categories.map((cat) => (
              <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <Badge 
                    text={cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                    variant={cat.type === 'pemasukan' ? 'success' : 'danger'}
                    className="me-2"
                  />
                  <span className="fw-bold">{cat.category}</span>
                </div>
                <IconButton
                  icon="bi bi-trash"
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteClick(cat._id)}
                  ariaLabel="Delete category"
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default CategoryPage;