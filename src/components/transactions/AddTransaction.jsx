import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah, parseRupiahToNumber } from '../../utils/formatRupiah';
import { ArrowUpDown, FileText, DollarSign, Tags, Calendar, XCircle, CheckCircle, Clock } from 'lucide-react';

const AddTransaction = ({ onAddTransaction, showToast, transactions, categories }) => {
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [type, setType] = useState('pengeluaran');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionInputRef = useRef(null);

  const normalize = (s) => (s || '').trim().toLowerCase();

  // unique descriptions dari transaksi (hindari duplikat)
  const uniqueDescriptions = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t?.description) set.add(t.description);
    });
    return Array.from(set);
  }, [transactions]);

  // Filter kategori berdasarkan type + set default kategori sekali saat type/categories berubah
  const filteredCategoriesForType = useMemo(
    () => categories.filter((cat) => cat.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (filteredCategoriesForType.length > 0) {
      setCategory((prev) => {
        // pertahankan pilihan jika masih valid
        const stillValid = filteredCategoriesForType.some((c) => c.category === prev);
        return stillValid ? prev : filteredCategoriesForType[0].category;
      });
    } else {
      setCategory('');
    }
  }, [filteredCategoriesForType]);

  // Suggestions: hanya muncul jika ada partial match dan BUKAN exact match
  useEffect(() => {
    const q = normalize(description);
    if (!q) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }

    const filtered = uniqueDescriptions
      .filter((d) => {
        const nd = normalize(d);
        return nd.includes(q) && nd !== q; // hilangkan exact match
      })
      .slice(0, 5);

    setSuggestions(filtered);
    setSuggestionsVisible(filtered.length > 0);
  }, [description, uniqueDescriptions]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSuggestionClick = (s) => {
    setDescription(s);
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  // Format input jumlah
  const handleAmountChange = (value) => {
    const numericValue = parseRupiahToNumber(value);
    setAmount(numericValue.toString());
    setFormattedAmount(numericValue === 0 ? '' : formatRupiah(numericValue).replace('Rp', '').trim());
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

    const newTransaction = {
      type,
      description,
      amount: parsedAmount,
      category,
      date: new Date(date).toISOString(),
    };

    try {
      await onAddTransaction(newTransaction);

      // Reset form
      setDescription('');
      setAmount('');
      setFormattedAmount('');
      setDate(getTodayDate());
      setSuggestions([]);
      setSuggestionsVisible(false);
    } catch {
      // Error ditangani di parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Jenis Transaksi */}
      <div>
        <label
          htmlFor="type"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Jenis Transaksi
        </label>
        <select
          id="type"
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          value={type}
          onChange={handleTypeChange}
          disabled={isSubmitting}
        >
          <option value="pengeluaran">💸 Expense (Pengeluaran)</option>
          <option value="pemasukan">💰 Income (Pemasukan)</option>
        </select>
      </div>

      {/* Deskripsi + Suggestions */}
      <div className="relative" ref={descriptionInputRef}>
        <label
          htmlFor="description"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <FileText className="w-4 h-4 mr-2" />
          Deskripsi
        </label>
        <input
          id="description"
          type="text"
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Masukkan deskripsi transaksi..."
          autoComplete="off"
          disabled={isSubmitting}
          required
          onBlur={() => {
            // tutup dropdown saat blur (sedikit delay supaya klik item tetap masuk)
            setTimeout(() => setSuggestionsVisible(false), 150);
          }}
          onFocus={() => {
            // buka kembali jika masih ada suggestions dan bukan exact match
            setSuggestionsVisible(suggestions.length > 0 && normalize(description) !== '' && !suggestions.includes(description));
          }}
        />
        {isSuggestionsVisible && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={`${s}-${idx}`}
                onMouseDown={(e) => e.preventDefault()} // cegah blur sebelum click
                onClick={() => handleSuggestionClick(s)}
                className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Jumlah */}
      <div>
        <label
          htmlFor="amount"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Jumlah (IDR)
        </label>
        <div className="flex">
          <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-xl">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Rp</span>
          </div>
          <input
            id="amount"
            type="text"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            value={formattedAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            disabled={isSubmitting}
            required
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Kategori → DIPINDAH ke bawah Jumlah (vertikal) */}
      <div>
        <label
          htmlFor="category"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <Tags className="w-4 h-4 mr-2" />
          Kategori
        </label>
        <select
          id="category"
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          required
        >
          {filteredCategoriesForType.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
          {filteredCategoriesForType.length === 0 && (
            <option value="" disabled>
              Tidak ada kategori tersedia
            </option>
          )}
        </select>
      </div>

      {/* Tanggal */}
      <div>
        <label
          htmlFor="date"
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Tanggal
        </label>
        <input
          id="date"
          type="date"
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
        <button
          type="button"
          className="px-6 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={() => navigate('/')}
          disabled={isSubmitting}
        >
          <XCircle className="w-5 h-5 mr-2" />
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Menambahkan...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Tambah Transaksi
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddTransaction;
