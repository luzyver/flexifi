import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect, SubmitButton, OutlineButton, LoadingSpinner } from './auth';

const AddTransaction = ({ onAddTransaction, showToast, transactions, categories, initialType = 'pengeluaran' }) => {
  const navigate = useNavigate();
  
  
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [type, setType] = useState(initialType);
  
  // Update type when initialType changes (when tab changes)
  useEffect(() => {
    setType(initialType);
  }, [initialType]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionInputRef = useRef(null);

  useEffect(() => {
    // Reset form fields when type changes
    setDescription('');
    setAmount('');
    
    // Set appropriate category based on transaction type
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

    // Format date properly
    const dateObj = new Date(date);
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      showToast('Invalid date format', 'error');
      setIsSubmitting(false);
      return;
    }

    const newTransaction = {
      type,
      description: description.trim(),
      amount: parsedAmount,
      category,
      date: dateObj.toISOString(),
    };

    try {
      
      
      const result = await onAddTransaction(newTransaction);
      
      
      // Reset form
      setDescription('');
      setAmount('');
      setDate(getTodayDate());
      setSuggestions([]);
      setSuggestionsVisible(false);
      
      showToast('Transaction added successfully!', 'success');
      
      // Navigate back to home after successful submission
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      
      showToast(error.message || 'Failed to add transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategoriesForType = categories.filter(cat => cat.type === type);

  return (
    <form onSubmit={onSubmit} className="needs-validation animate-fade-in" noValidate>
      <div className="row g-3">
        {/* Type is now controlled by Tabs */}

        <div className="col-12">
          <div className="position-relative" ref={descriptionInputRef}>
            <FormInput
              id="description"
              label="Deskripsi"
              icon="bi-card-text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Masukkan deskripsi transaksi..."
              autoComplete="off"
              disabled={isSubmitting}
              required
              size="lg"
              className="hover-lift"
            />
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul className="suggestions-list animate-fade-in">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="d-flex align-items-center hover-lift"
                    style={{ animationDelay: `${index * 0.05}s` }}
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
          <FormInput
            id="amount"
            label="Jumlah (IDR)"
            icon="bi-currency-dollar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            step="1000"
            min="1"
            disabled={isSubmitting}
            required
            size="lg"
            prepend="Rp"
            className="hover-lift"
          />
        </div>

        <div className="col-md-6">
          <FormSelect
            id="category"
            label="Kategori"
            icon="bi-tags-fill"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            required
            size="lg"
            options={filteredCategoriesForType.map((cat) => ({
              value: cat.category,
              label: cat.category
            }))}
            placeholder={filteredCategoriesForType.length === 0 ? "Tidak ada kategori tersedia" : ""}
            className="hover-lift"
          />
        </div>

        <div className="col-12">
          <FormInput
            id="date"
            label="Tanggal"
            icon="bi-calendar-event"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
            size="lg"
            className="hover-lift"
          />
        </div>

        <div className="col-12 mt-4">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <OutlineButton
              text="BATAL"
              icon="bi-x-circle"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              size="lg"
              variant="secondary"
              className="me-md-2 hover-lift"
            />
            <SubmitButton
              text={isSubmitting ? "Menambahkan..." : "TAMBAH TRANSAKSI"}
              icon={isSubmitting ? null : "bi-check-circle-fill"}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              variant="primary"
              className="hover-lift"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTransaction;