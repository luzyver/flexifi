import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah, parseRupiahToNumber } from '../utils/formatRupiah';

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

  useEffect(() => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].category);
    } else {
      setCategory('');
    }
  }, [type, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories.find(cat => cat.type === type);
      if (defaultCategory) {
        setCategory(defaultCategory.category);
      } else if (categories.length > 0) {
        setCategory(categories[0].category);
      }
    }
  }, [categories, type]);

  const uniqueDescriptions = Array.from(new Set(transactions.map(t => t.description)));

  useEffect(() => {
    if (description) {
      const filteredSuggestions = uniqueDescriptions
        .filter(d => d.toLowerCase().includes(description.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  }, [description]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setDescription(suggestion);
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
  };

  // Fungsi untuk memformat input jumlah
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
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategoriesForType = categories.filter(cat => cat.type === type);

  return (
    <form onSubmit={onSubmit} className="needs-validation" noValidate>
      <div className="row g-4">
        <div className="col-12">
          <div className="modern-form-group">
            <label htmlFor="type" className="modern-form-label">
              <i className="bi bi-arrow-up-down"></i>
              Jenis Transaksi
            </label>
            <select 
              id="type" 
              className="modern-form-select" 
              value={type} 
              onChange={handleTypeChange}
              disabled={isSubmitting}
            >
              <option value="pengeluaran">
                💸 Expense (Pengeluaran)
              </option>
              <option value="pemasukan">
                💰 Income (Pemasukan)
              </option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="modern-form-group position-relative" ref={descriptionInputRef}>
            <label htmlFor="description" className="modern-form-label">
              <i className="bi bi-card-text"></i>
              Deskripsi
            </label>
            <input
              id="description"
              type="text"
              className="modern-form-control"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Masukkan deskripsi transaksi..."
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-clock-history me-2 text-muted"></i>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="modern-form-group">
            <label htmlFor="amount" className="modern-form-label">
              <i className="bi bi-currency-dollar"></i>
              Jumlah (IDR)
            </label>
            <div className="input-group w-100">
              <span className="input-group-text">Rp</span>
              <input
                id="amount"
                type="text"
                className="modern-form-control"
                value={formattedAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="modern-form-group">
            <label htmlFor="category" className="modern-form-label">
              <i className="bi bi-tags-fill"></i>
              Kategori
            </label>
            <select 
              id="category" 
              className="modern-form-select" 
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
                <option value="" disabled>Tidak ada kategori tersedia</option>
              )}
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="modern-form-group">
            <label htmlFor="date" className="modern-form-label">
              <i className="bi bi-calendar-event"></i>
              Tanggal
            </label>
            <input
              id="date"
              type="date"
              className="modern-form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button 
              type="button" 
              className="modern-btn modern-btn-outline me-md-2"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              <i className="bi bi-x-circle me-2"></i>
              Batal
            </button>
            <button 
              type="submit" 
              className="modern-btn modern-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Menambahkan...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Tambah Transaksi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTransaction;