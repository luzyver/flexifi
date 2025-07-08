import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !date) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Amount must be a valid positive number', 'error');
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
      setDate(getTodayDate());
      setSuggestions([]);
      setSuggestionsVisible(false);
      
      // Navigate back to home after successful submission
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategoriesForType = categories.filter(cat => cat.type === type);

  return (
    <form onSubmit={onSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="type" className="form-label">
            <i className="bi bi-arrow-up-down me-2"></i>
            Transaction Type
          </label>
          <select 
            id="type" 
            className="form-select form-select-lg" 
            value={type} 
            onChange={handleTypeChange}
            disabled={isSubmitting}
          >
            <option value="pengeluaran">
              <i className="bi bi-arrow-down-circle"></i> Expense (Pengeluaran)
            </option>
            <option value="pemasukan">
              <i className="bi bi-arrow-up-circle"></i> Income (Pemasukan)
            </option>
          </select>
        </div>

        <div className="col-12">
          <div className="position-relative" ref={descriptionInputRef}>
            <label htmlFor="description" className="form-label">
              <i className="bi bi-card-text me-2"></i>
              Description
            </label>
            <input
              id="description"
              type="text"
              className="form-control form-control-lg"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter transaction description..."
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
          <label htmlFor="amount" className="form-label">
            <i className="bi bi-currency-dollar me-2"></i>
            Amount (IDR)
          </label>
          <div className="input-group input-group-lg">
            <span className="input-group-text">Rp</span>
            <input
              id="amount"
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              step="1000"
              min="1"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor="category" className="form-label">
            <i className="bi bi-tags-fill me-2"></i>
            Category
          </label>
          <select 
            id="category" 
            className="form-select form-select-lg" 
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
              <option value="" disabled>No categories available</option>
            )}
          </select>
        </div>

        <div className="col-12">
          <label htmlFor="date" className="form-label">
            <i className="bi bi-calendar-event me-2"></i>
            Date
          </label>
          <input
            id="date"
            type="date"
            className="form-control form-control-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="col-12 mt-4">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-lg me-md-2"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Add Transaction
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