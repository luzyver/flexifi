import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import Navbar from './components/Navbar';
import ConfirmationDialog from './components/ConfirmationDialog';
import LoadingOverlay from './components/LoadingOverlay';
import ToastNotification from './components/ToastNotification';

const DashboardLayout = ({ children, onLogout, username }) => {
  return (
    <div className="dashboard-container">
      <Navbar onLogout={onLogout} username={username} />
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
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('');
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const handleLogin = (loggedInUsername, authToken) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setToken(authToken);
    sessionStorage.setItem('token', authToken);
  };

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
    Cookies.remove('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
    setTransactions([]);
    navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    const refreshToken = async () => {
      setLoading(true);
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/refresh_token`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setIsAuthenticated(true);
            setUsername(data.username);
            setToken(data.token);
            sessionStorage.setItem('token', data.token);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
      setLoading(false);
    };

    refreshToken();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const performFetchTransactions = async () => {
        setLoading(true);
        
  
        try {
          const res = await fetch(`${API_BASE_URL}/transactions/all`, { 
            signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (signal.aborted) {
            return;
          }
  
          const data = await res.json();
          if (res.ok && data.success) {
            setTransactions(data.data);
          } else {
            showToast(data.error || `Failed to fetch transactions (Status: ${res.status}).`, 'error');
            if (res.status === 401 || res.status === 403) {
              handleLogout();
            }
          }
        } catch (err) {
          if (err.name === 'AbortError') {
            // Fetch request was cancelled by AbortController, no need to show error
          } else {
            showToast('Network error or server unreachable: ' + err.message, 'error');
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions([data.data, ...transactions]);
        showToast('Transaction added successfully!', 'success');
      } else {
        showToast(data.error || `Failed to add transaction (Status: ${res.status}).`, 'error');
      }
    } catch (err) {
      showToast('Error adding transaction: ' + err.message, 'error');
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions(transactions.filter((transaction) => transaction._id !== transactionToDeleteId));
        showToast('Transaction deleted successfully!', 'success');
      } else {
        showToast(data.error || `Failed to delete transaction (Status: ${res.status}).`, 'error');
      }
    } catch (err) {
      showToast('Error deleting transaction: ' + err.message, 'error');
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
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
        </Routes>
      ) : (
        <DashboardLayout onLogout={handleLogout} username={username}>

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
                  showToast={showToast}
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
            <Route
              path="/register"
              element={
                username === 'rezz' ? (
                  <RegisterPage showToast={showToast} token={token} />
                ) : (
                  <div className="main-content">
                    <h1>Unauthorized Access</h1>
                    <p>You do not have permission to access this page.</p>
                  </div>
                )
              }
            />
          </Routes>
          <ConfirmationDialog
            message="Are you sure you want to delete this transaction?"
            isOpen={isConfirmationDialogOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />

        </DashboardLayout>
      )}
      <ToastNotification message={toastMessage} type={toastType} />
    </>
  );
}

export default App;