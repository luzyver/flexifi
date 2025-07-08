import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

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
import { Card } from './components/auth';

// Fungsi fetch sederhana untuk digunakan di seluruh aplikasi
export const fetchAPI = async (url, options = {}) => {
  // Pastikan headers ada
  if (!options.headers) {
    options.headers = {};
  }

  // Tambahkan token otentikasi jika tersedia dan belum ditambahkan
  const token = localStorage.getItem('token');
  if (token && !options.headers.Authorization) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // Tambahkan Content-Type jika belum ada dan method bukan GET
  if (options.method && options.method !== 'GET' && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }

  // Tambahkan credentials jika belum ditentukan
  if (!options.credentials) {
    options.credentials = 'include';
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return { response: res, data };
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

const DashboardLayout = ({ children, onLogout, username, filterMonth, setFilterMonth, availableMonths }) => {
  return (
    <div className="dashboard-layout">
      <Navbar 
        onLogout={onLogout} 
        username={username} 
        filterMonth={filterMonth} 
        setFilterMonth={setFilterMonth} 
        availableMonths={availableMonths} 
      />
      <main className="main-content animate-fade-in">
        <div className="container-fluid">
          {children}
        </div>
      </main>
      <footer className="footer py-3 bg-light border-top text-center text-muted">
        <div className="container-fluid">
          <small>&copy; {new Date().getFullYear()} FlexiFi - Aplikasi Pengelolaan Keuangan</small>
        </div>
      </footer>
    </div>
  );
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {

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
  
  // Menggunakan useRef untuk menghindari dependensi siklik
  const handleLogoutRef = useRef(null);
  
  // Define showToast before it's used in handleLogout
  const showToast = useCallback((message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Function to fetch transactions - moved up to avoid initialization error
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/transactions/all`,
        {}
      );
      
      if (response.ok && data.success) {
        setTransactions(data.data);
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
          if (handleLogoutRef.current) handleLogoutRef.current();
        } else if (response.status === 401 || response.status === 403) {
          showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
          // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
          if (handleLogoutRef.current) handleLogoutRef.current();
        } else {
          showToast(data.error || `Failed to fetch transactions (Status: ${response.status}).`, 'error');
        }
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        showToast('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
      } else {
        showToast('Network error or server unreachable: ' + error.message, 'error');
      }
    }
  }, [isAuthenticated, token, API_BASE_URL, showToast, fetchAPI]);

  // Define handleLogout after showToast is defined
  // Ubah handleLogout untuk menggunakan fetchAPI
  const handleLogout = useCallback(async (showToastMessage = true) => {
    try {
      // Jika ada token, kirim permintaan logout ke server
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          await fetchAPI(
            `${API_BASE_URL}/auth/logout`,
            {
              method: 'POST',
            }
          );
        } catch (error) {
          // Continue with client-side logout even if server logout fails
        }
      }
    } finally {
      // Clear token from localStorage
      Cookies.remove('token');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      
      // Reset state
      setIsAuthenticated(false);
      setUsername(null);
      setToken(null);
      setTransactions([]);
      setCategories([]);
      
      // Tampilkan toast jika parameter showToastMessage true
      if (showToastMessage) {
        showToast('Anda telah keluar dari aplikasi', 'info');
      }
      
      // Redirect to login page
      navigate('/');
    }
  }, [API_BASE_URL, navigate, setCategories, setIsAuthenticated, setToken, setTransactions, setUsername, showToast, fetchAPI]);
  
  // Menetapkan handleLogout ke handleLogoutRef untuk menghindari dependensi siklik
  handleLogoutRef.current = handleLogout;

  // Function to fetch categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/categories`,
        {}
      );
      
      if (response.ok && data.success) {
        setCategories(data.data);
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else if (response.status === 401 || response.status === 403) {
          showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
          handleLogout();
        } else {
          showToast(data.error || 'Failed to fetch categories', 'error');
        }
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        showToast('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
      } else {
        showToast('Error fetching categories: ' + error.message, 'error');
      }
    }
  }, [isAuthenticated, token, API_BASE_URL, handleLogout, showToast]);
  
  // Function to change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // Validasi input
      if (!currentPassword || !newPassword) {
      throw new Error('Password saat ini dan password baru harus diisi');
      }
  
      // Periksa token
      if (!token) {
      throw new Error('Tidak ada token autentikasi');
      }
  
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/auth/change-password`,
        {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
  
      if (response.ok && data.success) {
        showToast('Password changed successfully', 'success');
        return true;
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
          return false;
        } else {
          showToast(data.error || 'Failed to change password', 'error');
          return false;
        }
      }
    } catch (error) {
      showToast('Error changing password: ' + error.message, 'error');
      return false;
    }
  };
  
  // Function to add a new category
  const addCategory = async (category) => {
  try {
    // Validasi data kategori
    if (!category.name || !category.type) {
      throw new Error('Nama dan tipe kategori harus diisi');
    }

    // Periksa token
    if (!token) {
      throw new Error('Tidak ada token autentikasi');
    }

    const { response, data } = await fetchAPI(
      `${API_BASE_URL}/categories`,
      {
        method: 'POST',
        body: JSON.stringify(category),
      }
    );

    if (response.ok && data.success) {
      // Update categories state dengan kategori baru
      setCategories(prevCategories => [...prevCategories, data.data]);
      showToast('Category added successfully', 'success');
      
      // Refresh kategori setelah penambahan
      fetchCategories();
      
      return data.data; // Return the created category
    } else {
      // Periksa apakah sesi telah diinvalidasi (login di device lain)
      if (data.sessionInvalidated) {
        showToast('Akun Anda telah login di perangkat lain', 'warning');
        handleLogout();
        throw new Error('Session invalidated');
      } else {
        throw new Error(data.error || 'Failed to add category');
      }
    }
  } catch (error) {
    showToast('Error adding category: ' + error.message, 'error');
    throw error;
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  // Fungsi handleLogin untuk autentikasi pengguna
  const handleLogin = useCallback(async (username, password, sessionId) => {
    setIsLoading(true);
    
    try {
      // Validasi input
      if (!username || !password) {
        throw new Error('Username dan password harus diisi');
      }
  
      // Jika fungsi ini dipanggil dari useAuth hook dengan token yang sudah ada
      if (sessionId) {
        // Set authentication state
        setIsAuthenticated(true);
        setUsername(username);
        setToken(password); // password parameter berisi token dalam kasus ini
        
        // Store token in localStorage
        localStorage.setItem('token', password);
        
        // Store sessionId if provided
        localStorage.setItem('sessionId', sessionId);
        
        showToast(`Welcome, ${username}!`, 'success');
          
        // Data akan diambil oleh useEffect yang memantau isAuthenticated dan token
          
        setIsLoading(false);
        return true;
      } else {
        // Jika fungsi ini dipanggil langsung (bukan dari useAuth hook)
        const { response, data } = await fetchAPI(
          `${API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          }
        );
        
        if (response.ok && data.success) {
          // Verify token exists in response
          if (!data.token) {
            showToast('Authentication error: No token received', 'error');
            return false;
          }
          
          // Set authentication state
          setIsAuthenticated(true);
          setUsername(data.username);
          setToken(data.token);
          
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          // Store sessionId if provided
          if (data.sessionId) {
            localStorage.setItem('sessionId', data.sessionId);
          }
          
          showToast(`Welcome, ${data.username}!`, 'success');
          
          // Data akan diambil oleh useEffect yang memantau isAuthenticated dan token
          
          setIsLoading(false);
          return true;
        } else {
          showToast(data.error || 'Login failed', 'error');
          return false;
        }
      }
    } catch (error) {
      showToast('Login error: ' + error.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, showToast, fetchAPI]);
  
  // Effect to fetch data after authentication
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCategories();
      fetchTransactions();
    }
  }, [isAuthenticated, token, fetchCategories, fetchTransactions]);

  // handleLogout function moved to the top of the component

  useEffect(() => {
    // Ubah loadTokenAndAuthenticate untuk menggunakan fetchAPI
    const loadTokenAndAuthenticate = async () => {
      const storedToken = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          // Set loading state saat memulai proses autentikasi
          setIsLoading(true);
          
          // Refresh token selalu memerlukan data terbaru dari server
          const { response, data } = await fetchAPI(
            `${API_BASE_URL}/auth/refresh_token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          
          if (response.ok && data.success) {
            setIsAuthenticated(true);
            setUsername(data.username);
            
            // Pastikan token baru disimpan
            if (data.token) {
              setToken(data.token);
              localStorage.setItem('token', data.token);
            }
            
            // Simpan sessionId jika ada
            if (data.sessionId) {
              localStorage.setItem('sessionId', data.sessionId);
            }
            
            // Fetch data setelah autentikasi berhasil
            fetchCategories();
            fetchTransactions();
          } else {
            // Periksa apakah sesi telah diinvalidasi (login di device lain)
            if (data.sessionInvalidated) {
              showToast('Akun Anda telah login di perangkat lain', 'warning');
              // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
              if (handleLogoutRef.current) handleLogoutRef.current();
            } else if (data.error && data.error.includes('expired')) {
              showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
              // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
              if (handleLogoutRef.current) handleLogoutRef.current();
            } else if (response.status === 401 || response.status === 403) {
              // Jangan tampilkan toast error saat pertama kali load
              // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
              if (handleLogoutRef.current) handleLogoutRef.current(false); // false = jangan tampilkan toast
            } else {
              // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
              if (handleLogoutRef.current) handleLogoutRef.current();
            }
          }
        } catch (error) {
          if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showToast('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 'error');
          }
          // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
          if (handleLogoutRef.current) handleLogoutRef.current(false); // false = jangan tampilkan toast
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
      // Hanya refresh token jika user terautentikasi
      if (isAuthenticated) {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {

          loadTokenAndAuthenticate();
        } else {
          // Menggunakan handleLogoutRef untuk menghindari dependensi siklik
          if (handleLogoutRef.current) handleLogoutRef.current();
        }
      }
    }, 10 * 60 * 1000); // 10 menit
    
    return () => {

      clearInterval(tokenRefreshInterval);
    };
  }, [API_BASE_URL, showToast, isAuthenticated, fetchTransactions, fetchCategories]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/register') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // fetchTransactions function moved to the top of the component to avoid initialization error


  // Effect to fetch transactions when authentication state changes
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTransactions();
    }
  }, [isAuthenticated, token, fetchTransactions]);

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

  // Fungsi untuk menambahkan transaksi
  const addTransaction = async (transaction) => {
    try {
      if (!token) {
        const errorMsg = 'Authentication token is missing. Please log in again.';
        showToast(errorMsg, 'error');
        handleLogout();
        throw new Error(errorMsg);
      }
      
      // Validate transaction data before sending
      if (!transaction.type || !transaction.amount || !transaction.description || !transaction.category) {
        const errorMsg = 'Missing required transaction fields';
        showToast(errorMsg, 'error');
        throw new Error(errorMsg);
      }
      
      // Ensure amount is a number
      if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
        transaction.amount = parseFloat(transaction.amount);
        if (isNaN(transaction.amount)) {
          const errorMsg = 'Amount must be a valid number';
          showToast(errorMsg, 'error');
          throw new Error(errorMsg);
        }
      }
      
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/transactions/all`,
        {
          method: 'POST',
          body: JSON.stringify(transaction),
        }
      );
      
      if (response.ok && data.success) {
        // Update state dengan transaksi baru
        setTransactions(prevTransactions => [data.data, ...prevTransactions]);
        showToast('Transaction added successfully!', 'success');
        
        // Refresh transaksi setelah penambahan
        fetchTransactions();
        return data.data; // Return the created transaction
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
          throw new Error('Session invalidated');
        } else {
          const errorMsg = data.error || `Failed to add transaction (Status: ${response.status}).`;
          showToast(errorMsg, 'error');
          throw new Error(errorMsg);
        }
      }
    } catch (err) {
      showToast('Error adding transaction: ' + err.message, 'error');
      throw err; // Re-throw the error so the component can handle it
    }
  };

  const handleDeleteClick = (id) => {
    setTransactionToDeleteId(id);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmationDialogOpen(false);
    try {
      // Periksa token
      if (!token) {
        throw new Error('Tidak ada token autentikasi');
      }
    
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/transactions/${transactionToDeleteId}`,
        { method: 'DELETE' }
      );
      
      if (response.ok && data.success) {
        // Update state dengan transaksi baru
        setTransactions(prevTransactions => 
          prevTransactions.filter(transaction => transaction._id !== transactionToDeleteId)
        );
        showToast('Transaction deleted successfully!', 'success');
        
        // Refresh transaksi setelah penghapusan
        fetchTransactions();
        return data.data; // Return the created transaction
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Failed to delete transaction (Status: ${response.status}).`, 'error');
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

  // Fungsi untuk menghapus kategori
  const handleConfirmDeleteCategory = async () => {
    setCategoryConfirmationDialogOpen(false);
    try {
      // Periksa token
      if (!token) {
        throw new Error('Tidak ada token autentikasi');
      }
    
      const { response, data } = await fetchAPI(
        `${API_BASE_URL}/categories/${categoryToDeleteId}`,
        { method: 'DELETE' }
      );
      
      if (response.ok && data.success) {
        // Perbarui kategori di UI melalui callback
        showToast('Kategori berhasil dihapus!', 'success');
        if (categoryDeleteSuccessCallback) {
          categoryDeleteSuccessCallback();
          
          // Refresh kategori setelah penghapusan
          fetchCategories();
        }
      } else {
        // Periksa apakah sesi telah diinvalidasi (login di device lain)
        if (data.sessionInvalidated) {
          showToast('Akun Anda telah login di perangkat lain', 'warning');
          handleLogout();
        } else {
          showToast(data.error || `Gagal menghapus kategori (Status: ${response.status}).`, 'error');
        }
      }
    } catch (err) {
      showToast('Error menghapus kategori: ' + err.message, 'error');
    } finally {
      setCategoryToDeleteId(null);
      setCategoryDeleteSuccessCallback(null);
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex-grow-1 d-flex flex-column">
        {!isAuthenticated && !isLoading ? (
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
            <Route path="/register" element={<RegisterPage showToast={showToast} />} />
          </Routes>
        ) : isLoading ? null : (
          <DashboardLayout 
            onLogout={() => {
              showToast('Anda telah keluar dari aplikasi.', 'info');
              handleLogout();
            }} 
            username={username}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            availableMonths={availableMonths}
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
                path="/admin-register"
                element={
                  username === 'rezz' ? (
                    <div className="main-content">
                      <RegisterPage showToast={showToast} />
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
                      <h1>Akses Tidak Diizinkan</h1>
                      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    </div>
                  )
                }
              />
            </Routes>
            <ConfirmationDialog
              message="Apakah Anda yakin ingin menghapus transaksi ini?"
              isOpen={isConfirmationDialogOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
            <ConfirmationDialog
              message="Apakah Anda yakin ingin menghapus kategori ini?"
              isOpen={isCategoryConfirmationDialogOpen}
              onConfirm={handleConfirmDeleteCategory}
              onCancel={handleCancelDeleteCategory}
            />
          </DashboardLayout>
        )}
        <ToastNotification message={toastMessage} type={toastType} />
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
      <Footer />
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
      <Footer />
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
=======
      <Footer />
>>>>>>> parent of 8ef2c7d (Merge pull request #18 from luzyver/develop)
    </div>
  );
}

export default App;
