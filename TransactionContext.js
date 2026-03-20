import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within TransactionProvider');
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('all');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = dateRange !== 'all' ? { dateRange } : {};
      const res = await axios.get('/api/transactions', { params });
      setTransactions(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const addTransaction = async (data) => {
    const res = await axios.post('/api/transactions', data);
    await fetchTransactions();
    return res.data;
  };

  const updateTransaction = async (id, data) => {
    const res = await axios.put(`/api/transactions/${id}`, data);
    await fetchTransactions();
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`/api/transactions/${id}`);
    await fetchTransactions();
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider value={{
      transactions, loading, error, dateRange, setDateRange,
      fetchTransactions, addTransaction, updateTransaction,
      deleteTransaction, totalIncome, totalExpense, totalBalance,
    }}>
      {children}
    </TransactionContext.Provider>
  );
};