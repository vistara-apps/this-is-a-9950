import React, { useState } from 'react';
import { Plus, Search, Filter, CreditCard, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Transactions = ({ transactions, onAddTransaction }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    merchant: ''
  });

  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      merchant: formData.merchant || 'Manual Entry'
    });
    setFormData({ description: '', amount: '', merchant: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="card p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="Coffee at Starbucks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="-5.99"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => setFormData({...formData, merchant: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Starbucks"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary flex-1">Add Transaction</button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions ({filteredTransactions.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <CreditCard className={`h-6 w-6 ${
                      transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      {transaction.isAnomaly && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" title="Anomaly detected" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{transaction.merchant}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {transaction.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;