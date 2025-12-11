import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering transactions
 */
export function useTransactionFilter(transactions) {
  const [filterMonth, setFilterMonth] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!filterMonth) return transactions;

    return transactions.filter(t => {
      const date = new Date(t.date);

      // Single date filter
      if (filterMonth.startsWith('singleDate-')) {
        const selectedDate = new Date(filterMonth.replace('singleDate-', ''));
        return (
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getDate() === selectedDate.getDate()
        );
      }

      // Year filter
      if (filterMonth.startsWith('year-') || filterMonth.startsWith('byYear-')) {
        const year = parseInt(filterMonth.replace(/^(year-|byYear-)/, ''));
        return date.getFullYear() === year;
      }

      // Month filter
      if (filterMonth.startsWith('byMonth-')) {
        const [month, year] = filterMonth.replace('byMonth-', '').split('-').map(Number);
        return date.getFullYear() === year && date.getMonth() === month;
      }

      // Standard YYYY-MM format
      if (filterMonth.includes('-')) {
        const [year, month] = filterMonth.split('-').map(Number);
        return date.getFullYear() === year && date.getMonth() === month - 1;
      }

      return true;
    });
  }, [transactions, filterMonth]);

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  return {
    filterMonth,
    setFilterMonth,
    filteredTransactions,
    ...totals,
  };
}
