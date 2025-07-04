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
    <>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={handleTypeChange}>
            <option value="pengeluaran">Pengeluaran</option>
            <option value="pemasukan">Pemasukan</option>
          </select>
        </div>
        <div className="form-control" ref={descriptionInputRef}>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
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
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            step="1000"
          />
        </div>
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoriesByType[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Add Transaction</button>
      </form>
    </>
  );
};

export default AddTransaction;
