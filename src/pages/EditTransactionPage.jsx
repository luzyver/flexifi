import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import EditTransaction from '../components/transactions/EditTransaction';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';

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
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Breadcrumb />
        <PageHeader
          title="Edit Transaksi"
          subtitle="Memuat data transaksi..."
          icon="edit"
        />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Memuat data transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Breadcrumb />
        <PageHeader
          title="Edit Transaksi"
          subtitle="Terjadi kesalahan"
          icon="alert-triangle"
        />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaksi Tidak Ditemukan</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">{error || 'Transaksi tidak ditemukan atau tidak dapat diakses'}</p>
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <Breadcrumb />
      <PageHeader
        title="Edit Transaksi"
        subtitle="Perbarui detail transaksi Anda"
        icon="edit-3"
      />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Transaksi</h3>
          </div>
        </div>
        <div className="p-6">
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
