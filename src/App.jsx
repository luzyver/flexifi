import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth, useTransactions, useCategories, useToast, useConfirmDialog, useTransactionFilter } from './hooks';

// Eager loaded pages (critical path)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

// Lazy loaded pages
const AddTransactionPage = lazy(() => import('./pages/AddTransactionPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const ActivationCodePage = lazy(() => import('./pages/ActivationCodePage'));
const EditTransactionPage = lazy(() => import('./pages/EditTransactionPage'));

// Components
import DashboardLayout from './components/layout/DashboardLayout';
import ConfirmationDialog from './components/common/ConfirmationDialog';

import ToastNotification from './components/common/ToastNotification';
import { formatRupiah } from './utils/formatRupiah';

// Page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
  </div>
);

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
  
  // Toast
  const { message: toastMessage, type: toastType, showToast } = useToast();
  
  // Auth
  const {
    isAuthenticated,
    username,
    token,
    isAuthLoading,
    handleLogin,
    handleLogout,
    handleSessionInvalidated,
  } = useAuth(showToast);

  // Transactions
  const {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
  } = useTransactions(isAuthenticated, token, showToast, handleSessionInvalidated);

  // Categories
  const {
    categories,
    isLoading: isCategoriesLoading,
    fetchCategories,
    deleteCategory,
  } = useCategories(isAuthenticated, showToast, handleSessionInvalidated);

  // Filter
  const {
    filterMonth,
    setFilterMonth,
    filteredTransactions,
    income: totalIncome,
    expense: totalExpense,
    balance,
  } = useTransactionFilter(transactions);

  // Confirmation dialogs
  const transactionDialog = useConfirmDialog();
  const categoryDialog = useConfirmDialog();

  // Clear transactions on logout
  useEffect(() => {
    if (!isAuthenticated) clearTransactions();
  }, [isAuthenticated, clearTransactions]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/register') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Get transaction/category details for dialog
  const getTransactionDetails = (id) => transactions.find(t => t._id === id);
  const getCategoryDetails = (id) => categories.find(c => c._id === id);

  const handleDeleteTransactionClick = (id) => {
    const transaction = getTransactionDetails(id);
    if (transaction) transactionDialog.openDialog(transaction);
  };

  const handleDeleteCategoryClick = (id, onSuccess) => {
    const category = getCategoryDetails(id);
    if (category) categoryDialog.openDialog(category, onSuccess);
  };

  const onLogout = () => {
    showToast('You have been logged out.', 'info');
    handleLogout();
  };

  // Loading state - simple spinner while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated routes
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} showToast={showToast} />} />
          <Route path="/register" element={<RegisterPage showToast={showToast} />} />
        </Routes>
        <ToastNotification message={toastMessage} type={toastType} />
      </div>
    );
  }

  // Authenticated routes
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardLayout
        onLogout={onLogout}
        username={username}
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
                allTransactions={transactions}
                onDeleteTransaction={handleDeleteTransactionClick}
                username={username}
                isLoading={isLoading}
                setFilterMonth={setFilterMonth}
              />
            }
          />
          <Route
            path="/add-transaction"
            element={
              <Suspense fallback={<PageLoader />}>
                <AddTransactionPage
                  onAddTransaction={addTransaction}
                  showToast={showToast}
                  transactions={transactions}
                  categories={categories}
                />
              </Suspense>
            }
          />
          <Route
            path="/history"
            element={
              <Suspense fallback={<PageLoader />}>
                <HistoryPage
                  transactions={filteredTransactions}
                  allTransactions={transactions}
                  onDeleteTransaction={handleDeleteTransactionClick}
                  isLoading={isLoading}
                  setFilterMonth={setFilterMonth}
                />
              </Suspense>
            }
          />
          <Route
            path="/categories"
            element={
              <Suspense fallback={<PageLoader />}>
                <CategoryPage
                  showToast={showToast}
                  onDeleteCategory={handleDeleteCategoryClick}
                  categories={categories}
                  onCategoryAdded={fetchCategories}
                  isLoading={isCategoriesLoading}
                />
              </Suspense>
            }
          />
          <Route
            path="/edit-transaction/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <EditTransactionPage
                  onUpdateTransaction={updateTransaction}
                  showToast={showToast}
                  transactions={transactions}
                  categories={categories}
                />
              </Suspense>
            }
          />
          <Route
            path="/change-password"
            element={
              <Suspense fallback={<PageLoader />}>
                <ChangePasswordPage showToast={showToast} />
              </Suspense>
            }
          />
          <Route
            path="/activation-codes"
            element={
              username === 'rezz' ? (
                <Suspense fallback={<PageLoader />}>
                  <ActivationCodePage showToast={showToast} token={token} />
                </Suspense>
              ) : (
                <div className="p-6">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Unauthorized Access</h1>
                  <p className="text-gray-600 dark:text-gray-400">You do not have permission to access this page.</p>
                </div>
              )
            }
          />
        </Routes>

        {/* Transaction Delete Dialog */}
        <ConfirmationDialog
          title="Konfirmasi Hapus Transaksi"
          message={
            transactionDialog.itemToDelete
              ? `Apakah Anda yakin ingin menghapus transaksi berikut?\n\n` +
                `Nama: ${transactionDialog.itemToDelete.description}\n` +
                `Jumlah: ${formatRupiah(transactionDialog.itemToDelete.amount)}\n` +
                `Tanggal: ${new Date(transactionDialog.itemToDelete.date).toLocaleDateString('id-ID')}\n` +
                `Tipe: ${transactionDialog.itemToDelete.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}`
              : 'Apakah Anda yakin ingin menghapus transaksi ini?'
          }
          confirmText="Hapus"
          cancelText="Batal"
          isOpen={transactionDialog.isOpen}
          isProcessing={transactionDialog.isProcessing}
          processingText="Menghapus..."
          onConfirm={() => transactionDialog.handleConfirm(deleteTransaction)}
          onCancel={transactionDialog.closeDialog}
        />

        {/* Category Delete Dialog */}
        <ConfirmationDialog
          title="Konfirmasi Hapus Kategori"
          message={
            categoryDialog.itemToDelete
              ? `Apakah Anda yakin ingin menghapus kategori berikut?\n\n` +
                `Nama: ${categoryDialog.itemToDelete.category}\n` +
                `Tipe: ${categoryDialog.itemToDelete.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
              : 'Apakah Anda yakin ingin menghapus kategori ini?'
          }
          confirmText="Hapus"
          cancelText="Batal"
          isOpen={categoryDialog.isOpen}
          isProcessing={categoryDialog.isProcessing}
          processingText="Menghapus..."
          onConfirm={() => categoryDialog.handleConfirm(deleteCategory)}
          onCancel={categoryDialog.closeDialog}
        />
      </DashboardLayout>

      <ToastNotification message={toastMessage} type={toastType} />
    </div>
  );
}

export default App;
