import { useState, useMemo, useCallback, memo } from 'react';
import Skeleton from '../components/common/Skeleton';
import { API_BASE_URL } from '../services/api';
import { FolderOpen, Plus, ArrowUpRight, ArrowDownRight, Trash2, Tag } from 'lucide-react';

const CategoryPage = memo(function CategoryPage({
  showToast,
  onDeleteCategory,
  categories,
  onCategoryAdded,
  isLoading,
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('pengeluaran');
  const [loading, setLoading] = useState(false);

  const { incomeCategories, expenseCategories } = useMemo(
    () => ({
      incomeCategories: categories.filter((cat) => cat.type === 'pemasukan'),
      expenseCategories: categories.filter((cat) => cat.type === 'pengeluaran'),
    }),
    [categories]
  );

  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newCategoryName.trim()) {
        showToast('Nama kategori tidak boleh kosong', 'error');
        return;
      }

      setLoading(true);
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
          showToast('Kategori berhasil ditambahkan!', 'success');
          setNewCategoryName('');
          onCategoryAdded();
        } else {
          showToast(data.error || 'Gagal menambahkan kategori', 'error');
        }
      } catch (error) {
        showToast('Error: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [newCategoryName, newCategoryType, showToast, onCategoryAdded]
  );

  const handleDeleteClick = useCallback(
    (id) => onDeleteCategory(id, onCategoryAdded),
    [onDeleteCategory, onCategoryAdded]
  );

  const CategoryList = ({ items, type, icon: Icon, iconBg }) => (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
          </h3>
        </div>
        <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Tag className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500">Belum ada kategori</p>
          </div>
        ) : (
          items.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Tag className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{cat.category}</span>
              </div>
              <button
                onClick={() => handleDeleteClick(cat._id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FolderOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Kategori</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Atur kategori transaksi Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Tambah Kategori</h3>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Contoh: Makanan"
                  className="input-modern"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipe
                </label>
                <select
                  value={newCategoryType}
                  onChange={(e) => setNewCategoryType(e.target.value)}
                  className="input-modern"
                  disabled={loading}
                >
                  <option value="pengeluaran">Pengeluaran</option>
                  <option value="pemasukan">Pemasukan</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !newCategoryName.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Tambah</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Category Lists */}
        <div className="lg:col-span-2 space-y-6">
          <CategoryList
            items={incomeCategories}
            type="pemasukan"
            icon={ArrowUpRight}
            iconBg="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <CategoryList
            items={expenseCategories}
            type="pengeluaran"
            icon={ArrowDownRight}
            iconBg="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
          />
        </div>
      </div>
    </div>
  );
});

export default CategoryPage;
