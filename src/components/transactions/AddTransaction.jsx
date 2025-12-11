import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah, parseRupiahToNumber } from '../../utils/formatRupiah';
import { ArrowUpDown, FileText, DollarSign, Tags, Calendar, X, Check, Clock } from 'lucide-react';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const AddTransaction = memo(function AddTransaction({
  onAddTransaction,
  showToast,
  transactions,
  categories,
}) {
  const navigate = useNavigate();
  const [type, setType] = useState('pengeluaran');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const uniqueDescriptions = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => t?.description && set.add(t.description));
    return Array.from(set);
  }, [transactions]);

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory((prev) => {
        const stillValid = filteredCategories.some((c) => c.category === prev);
        return stillValid ? prev : filteredCategories[0].category;
      });
    } else {
      setCategory('');
    }
  }, [filteredCategories]);

  useEffect(() => {
    const q = description.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = uniqueDescriptions
      .filter((d) => d.toLowerCase().includes(q) && d.toLowerCase() !== q)
      .slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [description, uniqueDescriptions]);

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
      await onAddTransaction({
        type,
        description,
        amount: parsedAmount,
        category,
        date: new Date(date).toISOString(),
      });
      setDescription('');
      setAmount('');
      setFormattedAmount('');
      setDate(getTodayDate());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Type */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <ArrowUpDown className="w-4 h-4" />
          Jenis Transaksi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('pengeluaran')}
            className={`p-4 rounded-xl border-2 transition-all ${
              type === 'pengeluaran'
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <span className="text-2xl mb-1">💸</span>
            <p className="font-medium">Pengeluaran</p>
          </button>
          <button
            type="button"
            onClick={() => setType('pemasukan')}
            className={`p-4 rounded-xl border-2 transition-all ${
              type === 'pemasukan'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <span className="text-2xl mb-1">💰</span>
            <p className="font-medium">Pemasukan</p>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="relative" ref={inputRef}>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <FileText className="w-4 h-4" />
          Deskripsi
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Contoh: Makan siang"
          className="input-modern"
          disabled={isSubmitting}
          required
        />
        {showSuggestions && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setDescription(s);
                  setShowSuggestions(false);
                }}
                className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                {s}
              </li>
            ))}
          </ul>
        )}
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
          disabled={isSubmitting}
          required
        >
          {filteredCategories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
          {filteredCategories.length === 0 && (
            <option value="" disabled>
              Tidak ada kategori
            </option>
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
          onClick={() => navigate('/')}
          disabled={isSubmitting}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
});

export default AddTransaction;
