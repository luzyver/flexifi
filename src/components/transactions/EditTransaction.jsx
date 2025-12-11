import { useState, useEffect, useMemo, memo } from 'react';
import { formatRupiah, parseRupiahToNumber } from '../../utils/formatRupiah';
import { ArrowLeft, Save, Calendar, DollarSign, FileText, Tags, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

const EditTransaction = memo(function EditTransaction({
  transaction,
  onUpdateTransaction,
  showToast,
  categories,
  onCancel,
}) {
  const [type, setType] = useState(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [formattedAmount, setFormattedAmount] = useState(
    formatRupiah(transaction.amount).replace('Rp', '').trim()
  );
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.some((c) => c.category === category)) {
      setCategory(filteredCategories[0].category);
    }
  }, [type, filteredCategories, category]);

  const handleAmountChange = (value) => {
    const numericValue = parseRupiahToNumber(value);
    setAmount(numericValue.toString());
    setFormattedAmount(numericValue === 0 ? '' : formatRupiah(numericValue).replace('Rp', '').trim());
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !category || !date) {
      showToast('Harap isi semua field', 'error');
      return;
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Jumlah harus angka positif', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onUpdateTransaction(transaction._id, {
        type,
        description,
        amount: parsedAmount,
        category,
        date,
      });
      if (success) onCancel();
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Jenis Transaksi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('pengeluaran')}
            disabled={isSubmitting}
            className={`p-4 rounded-xl border-2 transition-all ${
              type === 'pengeluaran'
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <TrendingDown className="w-5 h-5 mx-auto mb-1" />
            <p className="font-medium text-sm">Pengeluaran</p>
          </button>
          <button
            type="button"
            onClick={() => setType('pemasukan')}
            disabled={isSubmitting}
            className={`p-4 rounded-xl border-2 transition-all ${
              type === 'pemasukan'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <p className="font-medium text-sm">Pemasukan</p>
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <FileText className="w-4 h-4" />
          Deskripsi
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi transaksi"
          className="input-modern"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <DollarSign className="w-4 h-4" />
          Jumlah
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
          <input
            type="text"
            value={formattedAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="input-modern pl-12"
            disabled={isSubmitting}
            required
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Tags className="w-4 h-4" />
          Kategori
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-modern"
          disabled={isSubmitting || filteredCategories.length === 0}
          required
        >
          {filteredCategories.map((cat) => (
            <option key={cat._id} value={cat.category}>
              {cat.category}
            </option>
          ))}
          {filteredCategories.length === 0 && (
            <option value="">Tidak ada kategori</option>
          )}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Calendar className="w-4 h-4" />
          Tanggal
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-modern"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
});

export default EditTransaction;
