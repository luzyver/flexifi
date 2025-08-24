import { useState } from 'react';
import Skeleton from '../components/common/Skeleton';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import { ArrowUpCircle, ArrowDownCircle, Tags, Plus, Tag, ArrowUpDown, Trash2 } from 'lucide-react';

const CategoryPage = ({ showToast, onDeleteCategory, categories, onCategoryAdded, isLoading }) => {
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
        showToast('Kategori berhasil ditambahkan!', 'success');
        setNewCategoryName('');
        onCategoryAdded();
      } else {
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
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
    onDeleteCategory(id, onCategoryAdded);
  };

  const incomeCategories = categories.filter(cat => cat.type === 'pemasukan');
  const expenseCategories = categories.filter(cat => cat.type === 'pengeluaran');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Kelola Kategori"
        subtitle="Atur kategori transaksi Anda untuk pelacakan keuangan yang lebih baik"
        icon="tags"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Kategori Pemasukan
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-success-600 dark:text-success-400">
                {isLoading ? <Skeleton className="h-8 w-12 rounded" /> : incomeCategories.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-xl flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Kategori Pengeluaran
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-danger-600 dark:text-danger-400">
                {isLoading ? <Skeleton className="h-8 w-12 rounded" /> : expenseCategories.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in md:col-span-3 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <Tags className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Total Kategori
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400">
                {isLoading ? <Skeleton className="h-8 w-12 rounded" /> : categories.length}
              </div>
        </div>
      </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Add Category Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah Kategori Baru</h3>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div>
                  <label htmlFor="newCategoryName" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Masukkan nama kategori..."
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="newCategoryType" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Tipe Kategori
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading || isLoading || !newCategoryName.trim()}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Tambah Kategori
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Category Lists */}
        <div className="lg:col-span-3 space-y-6">
          {/* Income Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUpCircle className="w-5 h-5 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori Pemasukan</h3>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400">
                  {incomeCategories.length}
                </span>
              </div>
            </div>
            <div className="p-0">
              {isLoading ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4">
                      <div className="flex items-center">
                        <Skeleton className="w-8 h-8 rounded-lg mr-3" />
                        <Skeleton className="h-4 w-40 rounded" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ))}
                </div>
              ) : incomeCategories.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowUpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ada kategori pemasukan</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Tambahkan beberapa kategori pemasukan untuk memulai.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {incomeCategories.map((cat) => (
                    <div key={cat._id} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center mr-3">
                          <Tag className="w-4 h-4 text-success-600 dark:text-success-400" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{cat.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(cat._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowDownCircle className="w-5 h-5 text-danger-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kategori Pengeluaran</h3>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400">
                  {expenseCategories.length}
                </span>
              </div>
            </div>
            <div className="p-0">
              {isLoading ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4">
                      <div className="flex items-center">
                        <Skeleton className="w-8 h-8 rounded-lg mr-3" />
                        <Skeleton className="h-4 w-40 rounded" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ))}
                </div>
              ) : expenseCategories.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowDownCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ada kategori pengeluaran</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Tambahkan beberapa kategori pengeluaran untuk memulai.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenseCategories.map((cat) => (
                    <div key={cat._id} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-danger-100 dark:bg-danger-900/30 rounded-lg flex items-center justify-center mr-3">
                          <Tag className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{cat.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(cat._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};

export default CategoryPage;
