import React, { useState } from 'react';
import ValidationDialog from './ValidationDialog';

const AddTransaction = ({ onAddTransaction }) => {
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
  const [isValidationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setCategory(categoriesByType[newType][0] || '');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      setValidationMessage('Please fill in all fields');
      setValidationDialogOpen(true);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setValidationMessage('Amount must be a valid number');
      setValidationDialogOpen(true);
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
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
          />
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
      <ValidationDialog
          message={validationMessage}
          isOpen={isValidationDialogOpen}
          onClose={() => setValidationDialogOpen(false)}
        />
    </>
  );
};

export default AddTransaction;
