import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, DollarSign, FileText, Tag, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { formatRupiah, parseRupiahToNumber } from '../../utils/formatRupiah';

const EditTransaction = ({ transaction, onUpdateTransaction, showToast, categories, onCancel }) => {
  const [type, setType] = useState(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [formattedAmount, setFormattedAmount] = useState(formatRupiah(transaction.amount).replace('Rp', '').trim());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    if (filteredCategories.length > 0 && !filteredCategories.some(cat => cat.category === category)) {
      setCategory(filteredCategories[0].category);
    }
  }, [type, categories, category]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
  };

  const handleAmountChange = (value) => {
    // Simpan nilai numerik asli
    const numericValue = parseRupiahToNumber(value);
    setAmount(numericValue.toString());
    
    // Format untuk tampilan
    if (numericValue === 0) {
      setFormattedAmount('');
    } else {
      setFormattedAmount(formatRupiah(numericValue).replace('Rp', '').trim());
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !date) {
      showToast('Harap isi semua kolom', 'error');
      return;
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Jumlah harus berupa angka positif yang valid', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedTransaction = {
        type,
        description,
        amount: parsedAmount,
        category,
        date,
      };

      const success = await onUpdateTransaction(transaction._id, updatedTransaction);
      if (success) {
        onCancel(); // Close the edit form
      }
    } catch (error) {
      showToast('Error updating transaction: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategoriesForType = categories.filter(cat => cat.type === type);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Transaksi</label>
        <div className="relative">
          <select
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            value={type}
            onChange={handleTypeChange}
            disabled={isSubmitting}
          >
            <option value="pengeluaran">💸 Expense (Pengeluaran)</option>
            <option value="pemasukan">💰 Income (Pemasukan)</option>
          </select>
          {type === 'pemasukan' ? (
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          ) : type === 'pengeluaran' ? (
            <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          ) : (
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi transaksi..."
            autoComplete="off"
            disabled={isSubmitting}
            required
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (IDR)</label>
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            value={formattedAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            disabled={isSubmitting}
            required
            inputMode="numeric"
          />
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
        <div className="relative">
          <select
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting || filteredCategoriesForType.length === 0}
            required
          >
            {filteredCategoriesForType.length > 0 ? (
              filteredCategoriesForType.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
        <div className="relative">
          <input
            type="date"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal</span>
        </button>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditTransaction;
