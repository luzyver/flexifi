// client/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import komponen halaman
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';

// Dapatkan URL dasar API dari variabel lingkungan Vite
// import.meta.env adalah objek khusus Vite untuk variabel lingkungan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Pastikan API_BASE_URL tersedia
if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined in the environment. Please check your .env files.");
  // Anda mungkin ingin menampilkan pesan error di UI atau keluar dari aplikasi di sini.
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    // Membuat AbortController untuk membatalkan fetch
    const abortController = new AbortController();
    const signal = abortController.signal;

    const performFetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gunakan API_BASE_URL
        const res = await fetch(`${API_BASE_URL}/transactions`, { signal });
        
        if (signal.aborted) {
          console.log('Fetch was intentionally aborted by cleanup.');
          return;
        }

        const data = await res.json();
        if (res.ok && data.success) {
          setTransactions(data.data);
        } else {
          setError(data.error || `Failed to fetch transactions (Status: ${res.status}).`);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch request was cancelled by AbortController.');
        } else {
          setError('Network error or server unreachable: ' + err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    performFetchTransactions();

    return () => {
      abortController.abort();
    };
  }, []);

  const getAvailableMonths = () => {
    const months = new Set();
    transactions.forEach(t => {
      const date = new Date(t.date);
      months.add(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
    });
    return Array.from(months).sort((a, b) => new Date(b) - new Date(a));
  };

  const addTransaction = async (transaction) => {
    try {
      // Gunakan API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions([data.data, ...transactions]);
      } else {
        alert(data.error || `Failed to add transaction (Status: ${res.status}).`);
      }
    } catch (err) {
      alert('Error adding transaction: ' + err.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Gunakan API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      } else {
        alert(data.error || `Failed to delete transaction (Status: ${res.status}).`);
      }
    } catch (err) {
      alert('Error deleting transaction: ' + err.message);
    }
  };

  const filteredTransactions = filterMonth
    ? transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const filterDateParts = filterMonth.split('-');
        const filterYear = parseInt(filterDateParts[0]);
        const filterMonthIndex = parseInt(filterDateParts[1]) - 1;
        return (
          transactionDate.getFullYear() === filterYear &&
          transactionDate.getMonth() === filterMonthIndex
        );
      })
    : transactions;

  const totalIncome = filteredTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const availableMonths = getAvailableMonths();

  return (
    <Router>
      <Navbar />
      <div className="container">
        <h1>Money Tracker</h1>
        {error && <div className="error-message">{error}</div>}
        {loading && transactions.length === 0 && <div>Loading transactions...</div>}

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                income={totalIncome}
                expense={totalExpense}
                balance={balance}
                onAddTransaction={addTransaction}
              />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage
                transactions={filteredTransactions}
                onDeleteTransaction={deleteTransaction}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                availableMonths={availableMonths}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;