import { useState, useCallback, useEffect } from 'react';
import { categoriesApi, ApiError } from '../services/api';

/**
 * Custom hook for categories management
 */
export function useCategories(isAuthenticated, showToast, onSessionInvalidated) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.data);
    } catch (error) {
      if (error instanceof ApiError && error.sessionInvalidated) {
        onSessionInvalidated?.();
      } else {
        showToast?.(error.message || 'Failed to fetch categories', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast, onSessionInvalidated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoriesApi.delete(id);
      showToast?.('Kategori berhasil dihapus!', 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.sessionInvalidated) {
        onSessionInvalidated?.();
      } else {
        showToast?.(error.message || 'Failed to delete category', 'error');
      }
      return false;
    }
  }, [showToast, onSessionInvalidated]);

  return {
    categories,
    isLoading,
    fetchCategories,
    deleteCategory,
  };
}
