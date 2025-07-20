import { useState, useEffect } from 'react';
import { formatRupiah, parseRupiahToNumber } from '../utils/formatRupiah';

const EditTransaction = ({ transaction, onUpdateTransaction, showToast, categories, onCancel }) => {
  const [type, setType] = useState(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [formattedAmount, setFormattedAmount] = useState(formatRupiah(transaction.amount).replace('Rp', '').trim());
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    if (filteredCategories.length > 0 && !filteredCategories.some(cat => cat.category === category)) {
      setCategory(filteredCategories[0].category);
    }
  }, [type, categories, category]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
  };

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

    try {
      const updatedTransaction = {
        type,
        description,
        amount: parsedAmount,
        category,
        date,
      };

      const success = await onUpdateTransaction(transaction._id, updatedTransaction);
      if (success) {
        onCancel(); // Close the edit form
      }
    } catch (error) {
      showToast('Error updating transaction: ' + error.message, 'error');
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
            <label htmlFor="edit-type" className="modern-form-label">
              <i className="bi bi-arrow-up-down"></i>
              Jenis Transaksi
            </label>
            <select 
              id="edit-type" 
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
          <div className="modern-form-group">
            <label htmlFor="edit-description" className="modern-form-label">
              <i className="bi bi-card-text"></i>
              Deskripsi
            </label>
            <input
              id="edit-description"
              type="text"
              className="modern-form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi transaksi..."
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="modern-form-group">
            <label htmlFor="edit-amount" className="modern-form-label">
              <i className="bi bi-currency-dollar"></i>
              Jumlah (IDR)
            </label>
            <div className="input-group w-100">
              <span className="input-group-text">Rp</span>
              <input
                id="edit-amount"
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
            <label htmlFor="edit-category" className="modern-form-label">
              <i className="bi bi-tags-fill"></i>
              Kategori
            </label>
            <select 
              id="edit-category" 
              className="modern-form-select" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting || filteredCategoriesForType.length === 0}
              required
            >
              {filteredCategoriesForType.length > 0 ? (
                filteredCategoriesForType.map((cat) => (
                  <option key={cat._id} value={cat.category}>
                    {cat.category}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="modern-form-group">
            <label htmlFor="edit-date" className="modern-form-label">
              <i className="bi bi-calendar-date"></i>
              Tanggal
            </label>
            <input
              id="edit-date"
              type="date"
              className="modern-form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end gap-2 mt-4">
          <button 
            type="button" 
            className="modern-btn modern-btn-outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditTransaction;