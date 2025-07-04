import React, { useState, useEffect, useRef } from 'react';

const AddTransaction = ({ onAddTransaction, showToast, transactions }) => {
  const categoriesByType = {
    pemasukan: ['Gaji', 'Lembur', 'Joki', 'Lain-lain Pemasukan'],
    pengeluaran: ['Makanan', 'Transportasi', 'Jajan', 'Tagihan', 'Hiburan', 'E-Money', 'Lain-lain Pengeluaran'],
  };

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
  const [category, setCategory] = useState(categoriesByType['pengeluaran'][0] || '');
  const [date, setDate] = useState(getTodayDate());
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const descriptionInputRef = useRef(null);

  const uniqueDescriptions = Array.from(new Set(transactions.map(t => t.description)));

  useEffect(() => {
    if (description) {
      const filteredSuggestions = uniqueDescriptions
        .filter(d => d.toLowerCase().includes(description.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
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
    setCategory(categoriesByType[newType][0] || '');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      showToast('Amount must be a valid number', 'error');
      return;
    }

    const newTransaction = {
      type,
      description,
      amount: parsedAmount,
      category,
      date: new Date(date).toISOString(),
    };

    onAddTransaction(newTransaction);

    setDescription('');
    setAmount('');
    setCategory(categoriesByType[type][0] || '');
    setDate(getTodayDate());
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  return (
    <div className="card p-4 mb-4 shadow-lg border-0 rounded-3">
      <h5 className="card-title mb-4 text-primary fw-bold d-flex align-items-center">
        <i className="bi bi-plus-circle-fill me-2"></i> Add New Transaction
      </h5>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label text-muted">Type</label>
          <select id="type" className="form-select form-select-lg" value={type} onChange={handleTypeChange}>
            <option value="pengeluaran">Pengeluaran</option>
            <option value="pemasukan">Pemasukan</option>
          </select>
        </div>
        <div className="mb-3 position-relative" ref={descriptionInputRef}>
          <label htmlFor="description" className="form-label text-muted">Description</label>
          <input
            id="description"
            type="text"
            className="form-control form-control-lg"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter description..."
            autoComplete="off"
          />
          {isSuggestionsVisible && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label text-muted">Amount</label>
          <input
            id="amount"
            type="number"
            className="form-control form-control-lg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            step="1000"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label text-muted">Category</label>
          <select id="category" className="form-select form-select-lg" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoriesByType[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label text-muted">Date</label>
          <input
            id="date"
            type="date"
            className="form-control form-control-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;
