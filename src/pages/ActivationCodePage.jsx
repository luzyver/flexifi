import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/common/LoadingOverlay';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';

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

  return (
    <div className="container py-4">
      <LoadingOverlay isLoading={loading} />
      
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Kode Aktivasi"
        subtitle="Kelola kode pendaftaran pengguna"
        icon="bi-key-fill"
        actions={
          <button
            className="btn btn-primary"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Membuat...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Buat Kode Baru
              </>
            )}
          </button>
        }
      />

      <div className="card fade-in">
        <div className="card-header">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-list-ul me-2"></i>
            Semua Kode Aktivasi
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Status</th>
                  <th>Digunakan Oleh</th>
                  <th>Tanggal Dibuat</th>
                  <th>Tanggal Digunakan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activationCodes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Tidak ada kode aktivasi
                    </td>
                  </tr>
                ) : (
                  activationCodes.map((code) => (
                    <tr key={code._id}>
                      <td>
                        <span className="badge bg-dark">{code.code}</span>
                      </td>
                      <td>
                        {code.isUsed ? (
                          <span className="badge bg-secondary">Sudah Digunakan</span>
                        ) : code.isActivated ? (
                          <span className="badge bg-success">Aktif</span>
                        ) : (
                          <span className="badge bg-danger">Tidak Aktif</span>
                        )}
                      </td>
                      <td>{code.usedBy || '-'}</td>
                      <td>{formatDate(code.createdAt)}</td>
                      <td>{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
                      <td>
                        {!code.isUsed && (
                          <button
                            className={`btn btn-sm ${code.isActivated ? 'btn-outline-danger' : 'btn-outline-success'}`}
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
    </div>
  );
};

export default ActivationCodePage;