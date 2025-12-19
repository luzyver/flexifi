import { useState, useEffect, useCallback, memo } from 'react';
import { Key, Plus, CheckCircle, XCircle, AlertCircle, Calendar, User } from 'lucide-react';

const ActivationCodePage = memo(function ActivationCodePage({ showToast, token }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCodes(data.data);
      } else {
        showToast(data.error || 'Gagal mengambil data', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Kode berhasil dibuat', 'success');
        fetchCodes();
      } else {
        showToast(data.error || 'Gagal membuat kode', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = async (id, isActivated) => {
    const action = isActivated ? 'deactivate' : 'activate';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes/${id}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Kode berhasil ${isActivated ? 'dinonaktifkan' : 'diaktifkan'}`, 'success');
        fetchCodes();
      } else {
        showToast(data.error || 'Gagal mengubah status', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const StatusBadge = ({ code }) => {
    if (code.isUsed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
          <AlertCircle className="w-3 h-3" />
          Digunakan
        </span>
      );
    }
    if (code.isActivated) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          Aktif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
        <XCircle className="w-3 h-3" />
        Nonaktif
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kode Aktivasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola kode pendaftaran pengguna</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Membuat...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Buat Kode</span>
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Kode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Digunakan Oleh</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Dibuat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Key className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500">Belum ada kode aktivasi</p>
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-sm font-mono">
                        {code.code}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge code={code} />
                    </td>
                    <td className="px-6 py-4">
                      {code.usedBy ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <User className="w-4 h-4 text-slate-400" />
                          {code.usedBy}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(code.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!code.isUsed && (
                        <button
                          onClick={() => handleToggle(code._id, code.isActivated)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            code.isActivated
                              ? 'text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100'
                              : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100'
                          }`}
                        >
                          {code.isActivated ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default ActivationCodePage;
