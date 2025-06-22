// client/src/components/AddTransaction.jsx
import React, { useState } from 'react';

const AddTransaction = ({ onAddTransaction }) => {
  const categoriesByType = {
    pemasukan: ['Gaji', 'Lembur', 'Joki', 'Lain-lain Pemasukan'],
    pengeluaran: ['Makanan', 'Transportasi', 'Jajan', 'Tagihan', 'Hiburan', 'E-Money', 'Lain-lain Pengeluaran'],
  };

  // Helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [type, setType] = useState('pengeluaran');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // Perubahan PENTING di sini: Inisialisasi category dengan default untuk 'pengeluaran'
  const [category, setCategory] = useState(categoriesByType['pengeluaran'][0] || '');

  // Perubahan PENTING di sini: Inisialisasi date dengan tanggal hari ini
  const [date, setDate] = useState(getTodayDate());

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    // Reset category saat type berubah, atau set ke default pertama dari kategori baru
    setCategory(categoriesByType[newType][0] || '');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Validasi sekarang harus berfungsi lebih baik karena category dan date memiliki nilai awal
    if (!description || !amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }

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

    // Reset form setelah submit, pastikan category dan date direset ke default
    setDescription('');
    setAmount('');
    setCategory(categoriesByType[type][0] || ''); // Reset category sesuai type saat ini
    setDate(getTodayDate()); // Reset date ke hari ini
  };

  return (
    <form onSubmit={onSubmit} className="add-transaction-form">
      <h3>Add New Transaction</h3>
      <div className="form-control">
        <label htmlFor="type">Type</label>
        <select value={type} onChange={handleTypeChange}>
          <option value="pengeluaran">Pengeluaran</option>
          <option value="pemasukan">Pemasukan</option>
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
          step="0.01"
        />
      </div>
      <div className="form-control">
        <label htmlFor="category">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
