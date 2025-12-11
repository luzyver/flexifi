import { useState, useEffect, useCallback } from 'react';
import { transactionsApi, ApiError } from '../services/api';

/**
 * Custom hook for transactions management
 */
export function useTransactions(isAuthenticated, token, showToast, onSessionInvalidated) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    if (!isAuthenticated) return;

    const abortController = new AbortController();

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await transactionsApi.getAll(abortController.signal);
        setTransactions(data.data);
      } catch (error) {
        if (error.name === 'AbortError') return;
        
        if (error instanceof ApiError) {
          if (error.sessionInvalidated) {
            onSessionInvalidated?.();
          } else {
            showToast?.(error.message, 'error');
            if (error.status === 401 || error.status === 403) {
              onSessionInvalidated?.();
            }
          }
        } else {
          showToast?.('Network error: ' + error.message, 'error');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
    return () => abortController.abort();
  }, [isAuthenticated, token, showToast, onSessionInvalidated]);

  const addTransaction = useCallback(async (transaction) => {
    try {
      const data = await transactionsApi.create(transaction);
      setTransactions(prev => [data.data, ...prev]);
      showToast?.('Transaksi berhasil ditambahkan!', 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.sessionInvalidated) {
        onSessionInvalidated?.();
      } else {
        showToast?.(error.message || 'Failed to add transaction', 'error');
      }
      return false;
    }
  }, [showToast, onSessionInvalidated]);

  const updateTransaction = useCallback(async (id, updatedTransaction) => {
    try {
      const data = await transactionsApi.update(id, updatedTransaction);
      setTransactions(prev => 
        prev.map(t => t._id === id ? data.data : t)
      );
      showToast?.('Transaction updated successfully!', 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.sessionInvalidated) {
        onSessionInvalidated?.();
      } else {
        showToast?.(error.message || 'Failed to update transaction', 'error');
      }
      return false;
    }
  }, [showToast, onSessionInvalidated]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionsApi.delete(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
      showToast?.('Transaksi berhasil dihapus!', 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.sessionInvalidated) {
        onSessionInvalidated?.();
      } else {
        showToast?.(error.message || 'Failed to delete transaction', 'error');
      }
      return false;
    }
  }, [showToast, onSessionInvalidated]);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
  };
}
