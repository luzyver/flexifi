import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ThemeProvider } from './contexts/ThemeContext';

import HomePage from './pages/HomePage';
import AddTransactionPage from './pages/AddTransactionPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ActivationCodePage from './pages/ActivationCodePage';
import Navbar from './components/Navbar';
import ConfirmationDialog from './components/ConfirmationDialog';
import LoadingOverlay from './components/LoadingOverlay';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer';

const DashboardLayout = ({ children, onLogout, username, filterMonth, setFilterMonth, availableMonths }) => {
  return (
    <>
      <Navbar 
        onLogout={onLogout} 
        username={username} 
        filterMonth={filterMonth} 
        setFilterMonth={setFilterMonth} 
        availableMonths={availableMonths} 
      />
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
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
  const [isCategoryConfirmationDialogOpen, setCategoryConfirmationDialogOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const [categoryDeleteSuccessCallback, setCategoryDeleteSuccessCallback] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
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
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || 'Failed to fetch categories', 'error');
        }
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

  const handleLogin = (loggedInUsername, authToken, sessionId) => {
    setIsLoading(true);
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setToken(authToken);
    // Simpan token dan sessionId di localStorage agar tetap tersimpan saat tab ditutup
    localStorage.setItem('token', authToken);
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }
    setIsLoading(false);
  };

  const handleLogout = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
          // Tambahkan credentials untuk memastikan cookie dikirim dan diterima
          credentials: 'include'
        });
        if (!res.ok) {
          console.error('Server-side logout failed with status:', res.status);
        }
      } catch (error) {
        console.error('Network error during logout:', error);
      }
    } else {
      console.warn('No token found in local storage for logout. Proceeding with client-side logout.');
    }

    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    setIsAuthenticated(false);
    setUsername(null);
    setToken(null);
    setTransactions([]);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const loadTokenAndAuthenticate = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Set loading state saat memulai proses autentikasi
          setIsLoading(true);
          
          const res = await fetch(`${API_BASE_URL}/auth/refresh_token`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
            // Tambahkan credentials untuk memastikan cookie dikirim
            credentials: 'include'
          });
          const data = await res.json();
          
          if (res.ok) {
            setIsAuthenticated(true);
            setUsername(data.username);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            // Simpan sessionId jika ada
            if (data.sessionId) {
              localStorage.setItem('sessionId', data.sessionId);
            }
          } else {
            // Periksa apakah sesi telah diinvalidasi (login di device lain)
            if (data.sessionInvalidated) {
              showToast('Akun Anda telah login di perangkat lain', 'warning');
            } else {
              // Jangan tampilkan toast error saat pertama kali load
              // karena ini bisa mengganggu UX
              console.error('Token refresh failed');
            }
            handleLogout();
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          handleLogout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    loadTokenAndAuthenticate();
    
    // Setup interval untuk refresh token secara berkala
    // Refresh setiap 10 menit untuk mencegah token expired (yang 15 menit)
    const tokenRefreshInterval = setInterval(() => {
      if (localStorage.getItem('token')) {
        loadTokenAndAuthenticate();
      }
    }, 10 * 60 * 1000); // 10 menit
    
    return () => clearInterval(tokenRefreshInterval);
  }, [handleLogout]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/register') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const performFetchTransactions = async () => {
        
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
            // Periksa apakah sesi telah diinvalidasi (login di device lain)
            if (data.sessionInvalidated) {
              showToast('Akun Anda telah login di perangkat lain', 'warning');
              handleLogout();
            } else {
              showToast(data.error || `Failed to fetch transactions (Status: ${res.status}).`, 'error');
              if (res.status === 401 || res.status === 403) {
                handleLogout();
              }
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

  useEffect(() => {
    setAvailableMonths(getAvailableMonths());
  }, [transactions]);

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
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Failed to add transaction (Status: ${res.status}).`, 'error');
        }
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
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Failed to delete transaction (Status: ${res.status}).`, 'error');
        }
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

  const handleDeleteCategoryClick = (id, onSuccess) => {
    setCategoryToDeleteId(id);
    setCategoryConfirmationDialogOpen(true);
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
          categoryDeleteSuccessCallback();
        }
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Failed to delete category (Status: ${res.status}).`, 'error');
        }
      }
    } catch (err) {
      showToast('Error deleting category: ' + err.message, 'error');
    } finally {
      setCategoryToDeleteId(null);
      setCategoryDeleteSuccessCallback(null);
    }
  };

  const handleCancelDeleteCategory = () => {
    setCategoryConfirmationDialogOpen(false);
    setCategoryToDeleteId(null);
    setCategoryDeleteSuccessCallback(null);
  };

  const filteredTransactions = filterMonth
    ? transactions.filter(t => {
        const transactionDate = new Date(t.date);
        
        // Filter by date range
        if (filterMonth.startsWith('dateRange-')) {
          const dateRangeParts = filterMonth.replace('dateRange-', '').split('-');
          if (dateRangeParts.length >= 6) {
            const startDate = new Date(`${dateRangeParts[0]}-${dateRangeParts[1]}-${dateRangeParts[2]}`);
            const endDate = new Date(`${dateRangeParts[3]}-${dateRangeParts[4]}-${dateRangeParts[5]}`);
            const transactionDateOnly = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
            return transactionDateOnly >= startDate && transactionDateOnly <= endDate;
          }
        }
        
        // Filter by year only
        if (filterMonth.startsWith('year-')) {
          const filterYear = parseInt(filterMonth.replace('year-', ''));
          return transactionDate.getFullYear() === filterYear;
        }
        
        // Filter by month and year
        if (filterMonth.includes('-') && !filterMonth.startsWith('year-')) {
          const filterDateParts = filterMonth.split('-');
          const filterYear = parseInt(filterDateParts[0]);
          const filterMonthIndex = parseInt(filterDateParts[1]) - 1;
          return (
            transactionDate.getFullYear() === filterYear &&
            transactionDate.getMonth() === filterMonthIndex
          );
        }
        
        return true;
      })
    : transactions;

  const totalIncome = filteredTransactions.filter((t) => t.type === 'pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredTransactions.filter((t) => t.type === 'pengeluaran').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="d-flex flex-column min-vh-100">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex-grow-1 d-flex flex-column">
        {!isAuthenticated && !isLoading ? (
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
              <Route path="/register" element={<RegisterPage showToast={showToast} />} />
            </Routes>
          </div>
        ) : isLoading ? null : (
          <DashboardLayout 
            onLogout={() => {
              showToast('You have been logged out.', 'info');
              handleLogout();
            }} 
            username={username}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            availableMonths={availableMonths}
            transactions={transactions}
            transactions={transactions}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    income={totalIncome}
                    expense={totalExpense}
                    balance={balance}
                    transactions={filteredTransactions}
                    onDeleteTransaction={handleDeleteClick}
                    username={username}
                  />
                }
              />
              <Route
                path="/add-transaction"
                element={
                  <AddTransactionPage
                    onAddTransaction={addTransaction}
                    showToast={showToast}
                    transactions={transactions}
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
                path="/categories"
                element={
                  <CategoryPage
                    showToast={showToast}
                    onDeleteCategory={handleDeleteCategoryClick}
                    categories={categories}
                    onCategoryAdded={fetchCategories}
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
              <Route
                path="/activation-codes"
                element={
                  username === 'rezz' ? (
                    <ActivationCodePage
                      showToast={showToast}
                      token={token}
                    />
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
      {isAuthenticated && !isLoading && <Footer />}
    </div>
  );
}

export default App;