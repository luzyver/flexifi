import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditTransaction from '../components/EditTransaction';

const EditTransactionPage = ({ onUpdateTransaction, showToast, transactions, categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First try to find the transaction in the existing transactions array
    const existingTransaction = transactions.find(t => t._id === id);
    
    if (existingTransaction) {
      setTransaction(existingTransaction);
      setLoading(false);
    } else {
      // If not found in the existing transactions, fetch it from the API
      const fetchTransaction = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setTransaction(data.data);
          } else {
            throw new Error(data.error || `Failed to fetch transaction (Status: ${res.status}).`);
          }
        } catch (err) {
          console.error('Error fetching transaction:', err);
          setError('Transaksi tidak ditemukan atau terjadi kesalahan saat mengambil data');
          showToast('Transaksi tidak ditemukan', 'error');
        } finally {
          setLoading(false);
        }
      };

      fetchTransaction();
    }
  }, [id, transactions, showToast]);

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="card modern-card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Memuat data transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container py-4">
        <div className="card modern-card">
          <div className="card-body text-center py-5">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error || 'Transaksi tidak ditemukan'}
            </div>
            <button 
              className="modern-btn modern-btn-primary mt-3" 
              onClick={() => navigate(-1)}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card modern-card">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-pencil-square fs-4 me-2"></i>
          <h5 className="mb-0">Edit Transaksi</h5>
        </div>
        <div className="card-body">
          <EditTransaction 
            transaction={transaction}
            onUpdateTransaction={onUpdateTransaction}
            showToast={showToast}
            categories={categories}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTransactionPage;