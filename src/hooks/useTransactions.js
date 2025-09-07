import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch transactions from database
  const fetchTransactions = async (filters = {}) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            category_name,
            color,
            icon
          ),
          accounts (
            id,
            account_name,
            account_type
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Apply filters
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters.accountId) {
        query = query.eq('account_id', filters.accountId);
      }
      if (filters.minAmount !== undefined) {
        query = query.gte('amount', filters.minAmount);
      }
      if (filters.maxAmount !== undefined) {
        query = query.lte('amount', filters.maxAmount);
      }
      if (filters.isAnomaly !== undefined) {
        query = query.eq('is_anomaly', filters.isAnomaly);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Add new transaction
  const addTransaction = async (transactionData) => {
    if (!user) return null;

    try {
      // Categorize with AI
      const category = await aiService.categorizeExpense(
        transactionData.description,
        transactionData.amount,
        transactionData.merchant
      );

      // Detect anomalies
      const anomalyResult = await aiService.detectAnomaly(
        transactionData.amount,
        transactionData.description,
        transactions
      );

      // Get category ID
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_name', category)
        .single();

      const newTransaction = {
        user_id: user.id,
        amount: transactionData.amount,
        description: transactionData.description,
        merchant: transactionData.merchant || '',
        date: transactionData.date || new Date().toISOString(),
        account_id: transactionData.account_id,
        category_id: categoryData?.id,
        is_anomaly: anomalyResult.isAnomaly,
        anomaly_score: anomalyResult.confidence,
        currency: transactionData.currency || 'USD'
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select(`
          *,
          categories (
            id,
            category_name,
            color,
            icon
          ),
          accounts (
            id,
            account_name,
            account_type
          )
        `)
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction added successfully!');
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast.error('Failed to add transaction');
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (transactionId, updates) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .eq('user_id', user.id)
        .select(`
          *,
          categories (
            id,
            category_name,
            color,
            icon
          ),
          accounts (
            id,
            account_name,
            account_type
          )
        `)
        .single();

      if (error) throw error;

      setTransactions(prev =>
        prev.map(t => t.id === transactionId ? data : t)
      );
      toast.success('Transaction updated successfully!');
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast.error('Failed to update transaction');
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction');
      throw err;
    }
  };

  // Bulk categorize transactions
  const bulkCategorizeTransactions = async (transactionIds) => {
    if (!user || !transactionIds.length) return;

    try {
      const updates = [];
      
      for (const id of transactionIds) {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) continue;

        const category = await aiService.categorizeExpense(
          transaction.description,
          transaction.amount,
          transaction.merchant
        );

        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', user.id)
          .eq('category_name', category)
          .single();

        if (categoryData) {
          updates.push({
            id,
            category_id: categoryData.id
          });
        }
      }

      // Batch update
      for (const update of updates) {
        await supabase
          .from('transactions')
          .update({ category_id: update.category_id })
          .eq('id', update.id)
          .eq('user_id', user.id);
      }

      // Refresh transactions
      await fetchTransactions();
      toast.success(`Categorized ${updates.length} transactions!`);
    } catch (err) {
      console.error('Error bulk categorizing transactions:', err);
      toast.error('Failed to categorize transactions');
    }
  };

  // Get transaction statistics
  const getTransactionStats = (timeframe = 'month') => {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate
    );

    const expenses = filteredTransactions.filter(t => t.amount < 0);
    const income = filteredTransactions.filter(t => t.amount > 0);
    const anomalies = filteredTransactions.filter(t => t.is_anomaly);

    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const netAmount = totalIncome - totalExpenses;

    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(t => {
      const categoryName = t.categories?.category_name || 'Other';
      categoryBreakdown[categoryName] = (categoryBreakdown[categoryName] || 0) + Math.abs(t.amount);
    });

    return {
      totalTransactions: filteredTransactions.length,
      totalExpenses,
      totalIncome,
      netAmount,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      anomaliesCount: anomalies.length,
      categoryBreakdown,
      timeframe
    };
  };

  // Search transactions
  const searchTransactions = (query) => {
    if (!query.trim()) return transactions;

    const searchTerm = query.toLowerCase();
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm) ||
      t.merchant?.toLowerCase().includes(searchTerm) ||
      t.categories?.category_name.toLowerCase().includes(searchTerm) ||
      t.accounts?.account_name.toLowerCase().includes(searchTerm)
    );
  };

  // Load transactions on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    bulkCategorizeTransactions,
    getTransactionStats,
    searchTransactions
  };
};
