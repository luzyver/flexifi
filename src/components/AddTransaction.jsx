import React, { useState, useEffect, useRef } from 'react';

const AddTransaction = ({ onAddTransaction, showToast, transactions, categories }) => {
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
  const [category, setCategory] = useState(''); // Initialize with empty string
  const [date, setDate] = useState(getTodayDate());
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const descriptionInputRef = useRef(null);

  // Categories are now expected to be passed as a prop from the parent component.
  // This centralizes category fetching to avoid redundant network requests.

  useEffect(() => {
    // Update category selection when type changes or categories are loaded
    const filteredCategories = categories.filter(cat => cat.type === type);
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].category);
    } else {
      setCategory(''); // Clear category if no matching categories found
    }
  }, [type, categories]); // Add categories as dependency

  // Set default category based on initial type if categories are fetched
  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories.find(cat => cat.type === type);
      if (defaultCategory) {
        setCategory(defaultCategory.category);
      } else if (categories.length > 0) {
        setCategory(categories[0].category); // Fallback to first available category
      }
    }
  }, [categories, type]);

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
    setDate(getTodayDate());
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  const filteredCategoriesForType = categories.filter(cat => cat.type === type);

  return (
    <div className="card-body">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <select id="type" className="form-select" value={type} onChange={handleTypeChange}>
            <option value="pengeluaran">Pengeluaran</option>
            <option value="pemasukan">Pemasukan</option>
          </select>
        </div>
        <div className="mb-3 position-relative" ref={descriptionInputRef}>
          <label htmlFor="description" className="form-label">Description</label>
          <input
            id="description"
            type="text"
            className="form-control"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter description..."
            autoComplete="off"
          />
          {isSuggestionsVisible && suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 z-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="list-group-item list-group-item-action" onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            id="amount"
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            step="1000"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select id="category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {filteredCategoriesForType.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
            {filteredCategoriesForType.length === 0 && (
              <option value="" disabled>No categories available</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            id="date"
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;