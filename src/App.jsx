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
import EditTransactionPage from './pages/EditTransactionPage';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import ConfirmationDialog from './components/common/ConfirmationDialog';
import LoadingOverlay from './components/common/LoadingOverlay';
import ToastNotification from './components/common/ToastNotification';
import Footer from './components/layout/Footer';

const DashboardLayout = ({ children, onLogout, username, setFilterMonth, transactions }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar 
        username={username}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      <TopHeader
        onLogout={onLogout}
        username={username}
        setFilterMonth={setFilterMonth}
        transactions={transactions}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <div className="main-content-wrapper">
        <main className="main-content">
          {children}
        </main>
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
        setIsLoading(true);
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
            setIsLoading(false);
          }
        }
      };
  
      performFetchTransactions();
  
      return () => {
        abortController.abort();
      };
    }
  }, [isAuthenticated, handleLogout, token]);


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
        showToast('Transaksi berhasil ditambahkan!', 'success');
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

  // State untuk menyimpan detail transaksi yang akan dihapus
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    // Cari transaksi yang akan dihapus untuk mendapatkan detailnya
    const transaction = transactions.find(t => t._id === id);
    if (transaction) {
      // Simpan ID dan detail transaksi yang akan dihapus
      setTransactionToDeleteId(id);
      setTransactionToDelete(transaction);
      // Buka dialog konfirmasi
      setConfirmationDialogOpen(true);
    }
  };
  
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions(transactions.map(transaction => 
          transaction._id === id ? data.data : transaction
        ));
        showToast('Transaction updated successfully!', 'success');
        return true;
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Failed to update transaction (Status: ${res.status}).`, 'error');
        }
        return false;
      }
    } catch (err) {
      showToast('Error updating transaction: ' + err.message, 'error');
      return false;
    }
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
        showToast('Transaksi berhasil dihapus!', 'success');
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Gagal menghapus transaksi (Status: ${res.status}).`, 'error');
        }
      }
    } catch (err) {
      showToast('Error menghapus transaksi: ' + err.message, 'error');
    } finally {
      setTransactionToDeleteId(null);
      setTransactionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmationDialogOpen(false);
    setTransactionToDeleteId(null);
    setTransactionToDelete(null);
  };

  // State untuk menyimpan detail kategori yang akan dihapus
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDeleteCategoryClick = (id, onSuccess) => {
    // Cari kategori yang akan dihapus untuk mendapatkan detailnya
    const category = categories.find(c => c._id === id);
    if (category) {
      // Simpan ID dan detail kategori yang akan dihapus
      setCategoryToDeleteId(id);
      setCategoryToDelete(category);
      setCategoryConfirmationDialogOpen(true);
      setCategoryDeleteSuccessCallback(() => onSuccess);
    }
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
        showToast('Kategori berhasil dihapus!', 'success');
        if (categoryDeleteSuccessCallback) {
          categoryDeleteSuccessCallback();
        }
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Gagal menghapus kategori (Status: ${res.status}).`, 'error');
        }
      }
    } catch (err) {
      showToast('Error menghapus kategori: ' + err.message, 'error');
    } finally {
      setCategoryToDeleteId(null);
      setCategoryToDelete(null);
      setCategoryDeleteSuccessCallback(null);
    }
  };

  const handleCancelDeleteCategory = () => {
    setCategoryConfirmationDialogOpen(false);
    setCategoryToDeleteId(null);
    setCategoryToDelete(null);
    setCategoryDeleteSuccessCallback(null);
  };

  const filteredTransactions = filterMonth
    ? transactions.filter(t => {
        const transactionDate = new Date(t.date);
        
        // Filter by single date
        if (filterMonth.startsWith('singleDate-')) {
          const selectedDate = filterMonth.replace('singleDate-', '');
          const selectedDateObj = new Date(selectedDate);
          const transactionDateOnly = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
          const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());
          return transactionDateOnly.getTime() === selectedDateOnly.getTime();
        }
        
        // Filter by year only
        if (filterMonth.startsWith('year-') || filterMonth.startsWith('byYear-')) {
          const filterYear = parseInt(filterMonth.startsWith('year-') 
            ? filterMonth.replace('year-', '') 
            : filterMonth.replace('byYear-', ''));
          return transactionDate.getFullYear() === filterYear;
        }
        
        // Filter by month and year
        if ((filterMonth.includes('-') && !filterMonth.startsWith('year-') && !filterMonth.startsWith('singleDate-')) || 
            filterMonth.startsWith('byMonth-')) {
          
          // Handle new byMonth format
          if (filterMonth.startsWith('byMonth-')) {
            const parts = filterMonth.replace('byMonth-', '').split('-');
            const filterYear = parseInt(parts[1]);
            const filterMonthIndex = parseInt(parts[0]);
            return (
              transactionDate.getFullYear() === filterYear &&
              transactionDate.getMonth() === filterMonthIndex
            );
          }
          
          // Handle original format
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
            setFilterMonth={setFilterMonth}
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
                path="/edit-transaction/:id"
                element={
                  <EditTransactionPage
                    onUpdateTransaction={updateTransaction}
                    showToast={showToast}
                    transactions={transactions}
                    categories={categories}
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
              title="Konfirmasi Hapus Transaksi"
              message={
                transactionToDelete ? 
                `Apakah Anda yakin ingin menghapus transaksi berikut?\n\n` +
                `Nama: ${transactionToDelete.description}\n` +
                `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transactionToDelete.amount)}\n` +
                `Tanggal: ${new Date(transactionToDelete.date).toLocaleDateString('id-ID')}\n` +
                `Tipe: ${transactionToDelete.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
                : 'Apakah Anda yakin ingin menghapus transaksi ini?'
              }
              confirmText="Hapus"
              cancelText="Batal"
              confirmIcon="bi-trash-fill"
              confirmButtonClass="btn-danger"
              headerClass="bg-danger"
              isOpen={isConfirmationDialogOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
            <ConfirmationDialog
              title="Konfirmasi Hapus Kategori"
              message={
                categoryToDelete ? 
                `Apakah Anda yakin ingin menghapus kategori berikut?\n\n` +
                `Nama: ${categoryToDelete.name}\n` +
                `Tipe: ${categoryToDelete.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
                : 'Apakah Anda yakin ingin menghapus kategori ini?'
              }
              confirmText="Hapus"
              cancelText="Batal"
              confirmIcon="bi-trash-fill"
              confirmButtonClass="btn-danger"
              headerClass="bg-danger"
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