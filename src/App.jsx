import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import ValidationDialog from './components/ValidationDialog';
import ConfirmationDialog from './components/ConfirmationDialog';
import LoadingOverlay from './components/LoadingOverlay';

const DashboardLayout = ({ children, onLogout }) => {
  return (
    <div className="dashboard-container">
      <Navbar onLogout={onLogout} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined in the environment. Please check your .env files.");
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); // New state for username
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');
  const [isValidationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);

  const handleLogin = (loggedInUsername) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername); // Set username on login
  };

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUsername(null); // Clear username on logout
    setTransactions([]);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/status`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
          setUsername(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const performFetchTransactions = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const res = await fetch(`${API_BASE_URL}/transactions/all`, { 
            signal,
            credentials: 'include'
          });
          
          if (signal.aborted) {
            console.log('Fetch was intentionally aborted by cleanup.'); 
            return;
          }
  
          const data = await res.json();
          console.log('App.jsx: Received transactions data:', data);
          if (res.ok && data.success) {
            setTransactions(data.data);
          } else {
            setError(data.error || `Failed to fetch transactions (Status: ${res.status}).`);
            if (res.status === 401 || res.status === 403) {
              handleLogout();
            }
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
    }
  }, [isAuthenticated, handleLogout]);

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
      const res = await fetch(`${API_BASE_URL}/transactions/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions([data.data, ...transactions]);
      } else {
        setValidationMessage(data.error || `Failed to add transaction (Status: ${res.status}).`);
        setValidationDialogOpen(true);
      }
    } catch (err) {
      setValidationMessage('Error adding transaction: ' + err.message);
      setValidationDialogOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setTransactionToDeleteId(id);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmationDialogOpen(false);
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${transactionToDeleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions(transactions.filter((transaction) => transaction._id !== transactionToDeleteId));
      } else {
        setValidationMessage(data.error || `Failed to delete transaction (Status: ${res.status}).`);
        setValidationDialogOpen(true);
      }
    } catch (err) {
      setValidationMessage('Error deleting transaction: ' + err.message);
      setValidationDialogOpen(true);
    } finally {
      setTransactionToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationDialogOpen(false);
    setTransactionToDeleteId(null);
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

  const totalIncome = filteredTransactions.filter((t) => t.type === 'pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredTransactions.filter((t) => t.type === 'pengeluaran').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const availableMonths = getAvailableMonths();

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardLayout onLogout={handleLogout}>
          {error && <div className="error-message">{error}</div>}

          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  income={totalIncome}
                  expense={totalExpense}
                  balance={balance}
                  onAddTransaction={addTransaction}
                  transactions={filteredTransactions}
                  onDeleteTransaction={handleDeleteClick}
                  filterMonth={filterMonth}
                  setFilterMonth={setFilterMonth}
                  availableMonths={availableMonths}
                  username={username}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  transactions={filteredTransactions}
                  onDeleteTransaction={handleDeleteClick}
                />
              }
            />
          </Routes>
          <ValidationDialog
            message={validationMessage}
            isOpen={isValidationDialogOpen}
            onClose={() => setValidationDialogOpen(false)}
          />
          <ConfirmationDialog
            message="Are you sure you want to delete this transaction?"
            isOpen={isConfirmationDialogOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
          <LoadingOverlay isLoading={loading && isAuthenticated} />
        </DashboardLayout>
      )}
    </Router>
  );
}

export default App;