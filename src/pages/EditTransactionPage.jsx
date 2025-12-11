import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import EditTransaction from '../components/transactions/EditTransaction';

const EditTransactionPage = ({ onUpdateTransaction, showToast, transactions, categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const existing = transactions.find((t) => t._id === id);

    if (existing) {
      setTransaction(existing);
      setLoading(false);
    } else {
      const fetchTransaction = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setTransaction(data.data);
          } else {
            throw new Error(data.error || 'Transaksi tidak ditemukan');
          }
        } catch (err) {
          setError(err.message);
          showToast('Transaksi tidak ditemukan', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [id, transactions, showToast]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-12 text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Memuat data transaksi...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Transaksi Tidak Ditemukan
          </h3>
          <p className="text-slate-500 mb-6">{error || 'Transaksi tidak dapat diakses'}</p>
          <button onClick={() => navigate(-1)} className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Edit3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Transaksi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Perbarui detail transaksi</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6">
        <EditTransaction
          transaction={transaction}
          onUpdateTransaction={onUpdateTransaction}
          showToast={showToast}
          categories={categories}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default EditTransactionPage;
