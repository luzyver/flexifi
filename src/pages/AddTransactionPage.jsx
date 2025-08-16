import AddTransaction from '../components/transactions/AddTransaction';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import { Wallet, Lightbulb, CheckCircle, Tags, Calculator, Clock } from 'lucide-react';

const AddTransactionPage = ({ 
  onAddTransaction, 
  showToast, 
  transactions, 
  categories 
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <PageHeader
        title="Tambah Transaksi Baru"
        subtitle="Catat transaksi pemasukan atau pengeluaran Anda"
        icon="plus-circle"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Add Transaction Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Transaksi</h3>
              </div>
            </div>
            <div className="p-6">
              <AddTransaction 
                onAddTransaction={onAddTransaction}
                showToast={showToast}
                transactions={transactions}
                categories={categories}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Quick Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Lightbulb className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tips Pro</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Buat Deskripsi Jelas</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gunakan nama yang jelas dan deskriptif untuk pelacakan dan kategorisasi yang mudah.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <Tags className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Pilih Kategori</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pilih kategori yang tepat untuk wawasan dan laporan keuangan yang lebih baik.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <Calculator className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Periksa Ulang</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verifikasi jumlah dan tanggal sebelum menyimpan untuk menjaga catatan yang akurat.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-info-100 dark:bg-info-900/30 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <Clock className="w-5 h-5 text-info-600 dark:text-info-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tetap Konsisten</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Catat transaksi secara teratur untuk gambaran keuangan yang paling akurat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;