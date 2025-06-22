// client/src/components/AddTransaction.jsx
import React, { useState } from 'react';
// import { formatRupiah } from '../utils/formatCurrency'; // Tidak perlu di sini

const AddTransaction = ({ onAddTransaction }) => {
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(''); // Tetap string untuk input, akan di-parse saat submit
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }

    // Pastikan amount di-parse sebagai angka sebelum dikirim
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      alert('Amount must be a valid number');
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
    setCategory('');
    setDate('');
  };

  return (
    <form onSubmit={onSubmit} className="add-transaction-form">
      <h3>Add New Transaction</h3>
      <div className="form-control">
        <label htmlFor="type">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="form-control">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
        />
      </div>
      <div className="form-control">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount..."
          step="0.01" // Tetap pakai step 0.01 untuk mengakomodasi sen jika perlu
        />
      </div>
      <div className="form-control">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category..."
        />
      </div>
      <div className="form-control">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button type="submit" className="btn">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;