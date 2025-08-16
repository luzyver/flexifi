import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/common/LoadingOverlay';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import { Key, Plus, List, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ActivationCodePage = ({ showToast, token }) => {
  const navigate = useNavigate();
  const [activationCodes, setActivationCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchActivationCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActivationCodes(data.data);
      } else {
        // Check if session was invalidated (logged in on another device)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Remove token and sessionId from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          // Redirect to home page
          navigate('/');
        } else {
          showToast(data.error || 'Gagal mengambil kode aktivasi', 'error');
        }
      }
    } catch (error) {
      showToast('Error mengambil kode aktivasi: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast, navigate]);

  useEffect(() => {
    fetchActivationCodes();
  }, [fetchActivationCodes]);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Kode aktivasi berhasil dibuat', 'success');
        fetchActivationCodes();
      } else {
        // Check if session was invalidated (logged in on another device)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Remove token and sessionId from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          // Redirect to home page
          navigate('/');
        } else {
          showToast(data.error || 'Gagal membuat kode aktivasi', 'error');
        }
      }
    } catch (error) {
      showToast('Error membuat kode aktivasi: ' + error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleActivation = async (id, currentStatus) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activation-codes/${id}/${action}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Kode aktivasi berhasil ${action === 'activate' ? 'diaktifkan' : 'dinonaktifkan'}`, 'success');
        fetchActivationCodes();
      } else {
        // Check if session was invalidated (logged in on another device)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Remove token and sessionId from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          // Redirect to home page
          navigate('/');
        } else {
          showToast(data.error || `Gagal ${action === 'activate' ? 'mengaktifkan' : 'menonaktifkan'} kode aktivasi`, 'error');
        }
      }
    } catch (error) {
      showToast(`Error ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} kode aktivasi: ` + error.message, 'error');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadge = (code) => {
    if (code.isUsed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          <AlertCircle className="w-3 h-3 mr-1" />
          Sudah Digunakan
        </span>
      );
    } else if (code.isActivated) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aktif
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Tidak Aktif
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <LoadingOverlay isLoading={loading} />
      
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Kode Aktivasi"
        subtitle="Kelola kode pendaftaran pengguna"
        icon="key"
        actions={
          <button
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Membuat...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Buat Kode Baru
              </>
            )}
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <List className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semua Kode Aktivasi</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Digunakan Oleh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal Dibuat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal Digunakan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activationCodes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Key className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada kode aktivasi</p>
                  </td>
                </tr>
              ) : (
                activationCodes.map((code) => (
                  <tr key={code._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono bg-gray-900 dark:bg-gray-700 text-white">
                        {code.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(code)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {code.usedBy ? (
                          <>
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900 dark:text-white">{code.usedBy}</span>
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(code.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {code.usedAt ? (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(code.usedAt)}
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!code.isUsed && (
                        <button
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            code.isActivated
                              ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
                              : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800'
                          }`}
                          onClick={() => handleToggleActivation(code._id, code.isActivated)}
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
};

export default ActivationCodePage;