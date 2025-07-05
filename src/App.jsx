import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import CategoryPage from './pages/CategoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Navbar from './components/Navbar';
import ConfirmationDialog from './components/ConfirmationDialog';
import LoadingOverlay from './components/LoadingOverlay';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer'; // Import Footer component

const DashboardLayout = ({ children, onLogout, username }) => {
  return (
    <>
      <Navbar onLogout={onLogout} username={username} />
      <main className="main-content">
        {children}
      </main>
    </>
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
  const [isCategoryConfirmationDialogOpen, setCategoryConfirmationDialogOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const [categoryDeleteSuccessCallback, setCategoryDeleteSuccessCallback] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [categories, setCategories] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        // showToast('Authentication token not found. Please log in.', 'error');
        return;
      }
      const res = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.data);
      } else {
        showToast(data.error || 'Failed to fetch categories', 'error');
      }
    } catch (error) {
      showToast('Error fetching categories: ' + error.message, 'error');
    }
  }, [API_BASE_URL, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  const handleLogin = (loggedInUsername, authToken) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setToken(authToken);
    sessionStorage.setItem('token', authToken);
  };

  const handleLogout = useCallback(async () => {
    // Ensure token exists before attempting to send it to the backend for invalidation
    const currentToken = sessionStorage.getItem('token');
    if (currentToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        // Optionally, check res.ok here if you want to handle server-side logout failures
        if (!res.ok) {
          console.error('Server-side logout failed with status:', res.status);
          // You might show a toast here, but usually for logout, client-side clear is primary
        }
      } catch (error) {
        console.error('Network error during logout:', error);
      }
    } else {
      console.warn('No token found in session storage for logout. Proceeding with client-side logout.');
    }

    // Always clear client-side state regardless of backend logout success
    Cookies.remove('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
    setTransactions([]);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const loadTokenAndAuthenticate = async () => {
      setLoading(true);
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken); // Set token state from sessionStorage immediately
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
            setToken(data.token); // Update token state with refreshed token
            sessionStorage.setItem('token', data.token);
          } else {
            showToast('Session expired. Please log in again.', 'error');
            handleLogout();
          }
        } catch (error) {
          showToast('Session expired. Please log in again.', 'error');
          handleLogout();
        }
      } else {
        // If no stored token, ensure isAuthenticated is false
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    loadTokenAndAuthenticate();
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
  }, [isAuthenticated, handleLogout, token]);

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

  // Category Deletion Handlers
  const handleDeleteCategoryClick = (id, onSuccess) => {
    setCategoryToDeleteId(id);
    setCategoryConfirmationDialogOpen(true);
    // Store the onSuccess callback to be called after confirmation
    setCategoryDeleteSuccessCallback(() => onSuccess);
  };

  const handleConfirmDeleteCategory = async () => {
    setCategoryConfirmationDialogOpen(false);
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${categoryToDeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Category deleted successfully!', 'success');
        if (categoryDeleteSuccessCallback) {
          categoryDeleteSuccessCallback(); // Call the stored callback
        }
      } else {
        showToast(data.error || `Failed to delete category (Status: ${res.status}).`, 'error');
      }
    } catch (err) {
      showToast('Error deleting category: ' + err.message, 'error');
    } finally {
      setCategoryToDeleteId(null);
      setCategoryDeleteSuccessCallback(null); // Clear the callback
    }
  };

  const handleCancelDeleteCategory = () => {
    setCategoryConfirmationDialogOpen(false);
    setCategoryToDeleteId(null);
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
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
          </Routes>
        ) : (
          <DashboardLayout onLogout={() => {
            showToast('You have been logged out.', 'info');
            handleLogout();
          }} username={username}>

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
                    categories={categories}
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
                    <div className="main-content">
                      <RegisterPage showToast={showToast} token={token} />
                    </div>
                  ) : (
                    <div className="main-content">
                      <h1>Unauthorized Access</h1>
                      <p>You do not have permission to access this page.</p>
                    </div>
                  )
                }
              />
              <Route
                path="/categories"
                element={
                  <CategoryPage
                    showToast={showToast}
                    onDeleteCategory={handleDeleteCategoryClick}
                  />
                }
              />
              <Route
                path="/change-password"
                element={
                  <ChangePasswordPage
                    showToast={showToast}
                  />
                }
              />
            </Routes>
            <ConfirmationDialog
              message="Are you sure you want to delete this transaction?"
              isOpen={isConfirmationDialogOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
            <ConfirmationDialog
              message="Are you sure you want to delete this category?"
              isOpen={isCategoryConfirmationDialogOpen}
              onConfirm={handleConfirmDeleteCategory}
              onCancel={handleCancelDeleteCategory}
            />
          </DashboardLayout>
        )}
        <ToastNotification message={toastMessage} type={toastType} />
      </div>
      <Footer />
    </div>
  );
}

export default App;