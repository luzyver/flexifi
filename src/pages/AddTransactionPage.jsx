import { memo } from 'react';
import AddTransaction from '../components/transactions/AddTransaction';
import { Receipt, Lightbulb, CheckCircle, Tags, Calculator, Clock } from 'lucide-react';

const TIPS = [
  { icon: CheckCircle, title: 'Deskripsi Jelas', desc: 'Gunakan nama yang mudah dikenali' },
  { icon: Tags, title: 'Pilih Kategori', desc: 'Kategorikan untuk analisis lebih baik' },
  { icon: Calculator, title: 'Periksa Ulang', desc: 'Pastikan jumlah dan tanggal benar' },
  { icon: Clock, title: 'Konsisten', desc: 'Catat transaksi secara rutin' },
];

const AddTransactionPage = memo(function AddTransactionPage({
  onAddTransaction,
  showToast,
  transactions,
  categories,
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Receipt className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tambah Transaksi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Catat pemasukan atau pengeluaran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <AddTransaction
              onAddTransaction={onAddTransaction}
              showToast={showToast}
              transactions={transactions}
              categories={categories}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Tips</h3>
            </div>
            <div className="space-y-4">
              {TIPS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddTransactionPage;
