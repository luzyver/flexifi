import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import { Card, Badge, IconButton, Breadcrumb, SubmitButton } from '../components/auth';
import { fetchAPI } from '../App';

const ActivationCodePage = ({ showToast, token }) => {
  const navigate = useNavigate();
  const [activationCodes, setActivationCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchActivationCodes = useCallback(async () => {
    try {
      setLoading(true);
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/activation-codes`,
        {}
      );

      if (response.ok && data.success) {
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
  }, [API_BASE_URL, showToast, navigate]);

  useEffect(() => {
    fetchActivationCodes();
  }, [fetchActivationCodes]);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/activation-codes/generate`,
        {
          method: 'POST',
        }
      );

      if (response.ok && data.success) {
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
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/activation-codes/${id}/${action}`,
        {
          method: 'PUT',
        }
      );

      if (response.ok && data.success) {
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
      
      {/* Breadcrumb removed */}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Kode Aktivasi</h1>
        <SubmitButton
          text="Generate Kode Baru"
          icon="bi bi-plus-circle-fill"
          onClick={handleGenerateCode}
          isLoading={isGenerating}
          loadingText="Membuat..."
          variant="primary"
        />
      </div>

      <Card className="fade-in shadow-sm">
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
                    <i className="bi bi-key display-4 text-muted mb-3 d-block"></i>
                    <p className="text-muted">Tidak ada kode aktivasi</p>
                  </td>
                </tr>
              ) : (
                activationCodes.map((code) => (
                  <tr key={code._id}>
                    <td>
                      <Badge text={code.code} variant="dark" />
                    </td>
                    <td>
                      {code.isUsed ? (
                        <Badge text="Sudah Digunakan" variant="secondary" />
                      ) : code.isActivated ? (
                        <Badge text="Aktif" variant="success" />
                      ) : (
                        <Badge text="Tidak Aktif" variant="danger" />
                      )}
                    </td>
                    <td>{code.usedBy || '-'}</td>
                    <td>{formatDate(code.createdAt)}</td>
                    <td>{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
                    <td>
                      {!code.isUsed && (
                        <IconButton
                          icon={code.isActivated ? "bi bi-x-circle" : "bi bi-check-circle"}
                          variant={code.isActivated ? "outline-danger" : "outline-success"}
                          size="sm"
                          onClick={() => handleToggleActivation(code._id, code.isActivated)}
                          tooltip={code.isActivated ? 'Nonaktifkan' : 'Aktifkan'}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ActivationCodePage;