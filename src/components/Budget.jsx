import React, { useState } from 'react';
import { Plus, Target, TrendingUp, TrendingDown, Edit3 } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Budget = ({ budgets, transactions, onUpdateBudget }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter(t => 
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const getBudgetProgress = (budget) => {
    const spent = currentMonthTransactions
      .filter(t => t.category === budget.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;
    
    return { spent, percentage, remaining };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const budgetData = {
      id: editingBudget?.id || Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData);
    } else {
      // Add new budget logic would go here
    }
    
    setFormData({ category: '', amount: '', period: 'monthly' });
    setShowAddForm(false);
    setEditingBudget(null);
  };

  const startEdit = (budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setEditingBudget(budget);
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Budget Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && (
        <div className="card p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="Food & Dining"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="500.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary flex-1">
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBudget(null);
                  setFormData({ category: '', amount: '', period: 'monthly' });
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgets.reduce((sum, budget) => {
                  const { spent } = getBudgetProgress(budget);
                  return sum + spent;
                }, 0).toLocaleString()}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgets.reduce((sum, budget) => {
                  const { remaining } = getBudgetProgress(budget);
                  return sum + remaining;
                }, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const { spent, percentage, remaining } = getBudgetProgress(budget);
          
          return (
            <div key={budget.id} className="card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                <button 
                  onClick={() => startEdit(budget)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium">${spent.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      percentage > 90 ? 'bg-red-500' : 
                      percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    ${remaining.toFixed(2)} remaining
                  </div>
                  <div className={`text-sm font-medium ${
                    percentage > 90 ? 'text-red-600' : 
                    percentage > 70 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    Budget: ${budget.amount.toFixed(2)} / {budget.period}
                  </div>
                </div>
              </div>
              
              {percentage > 90 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    ⚠️ You're close to exceeding your budget for this category.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="card p-12 text-center">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set up</h3>
          <p className="text-gray-500 mb-4">
            Create your first budget to start tracking your spending goals.
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            Create Your First Budget
          </button>
        </div>
      )}
    </div>
  );
};

export default Budget;