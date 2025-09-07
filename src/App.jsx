import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Target, Brain, Menu, X, Home, Wallet, BarChart3, Settings } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import AIInsights from './components/AIInsights';
import { useAI } from './hooks/useAI';
import { mockData } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [transactions, setTransactions] = useState(mockData.transactions);
  const [budgets, setBudgets] = useState(mockData.budgets);
  const [savingsGoals, setSavingsGoals] = useState(mockData.savingsGoals);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { categorizeExpense, detectAnomaly, generateSavingsRecommendation } = useAI();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Brain },
  ];

  const addTransaction = async (newTransaction) => {
    const categorizedTransaction = {
      ...newTransaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: await categorizeExpense(newTransaction.description, newTransaction.amount),
      isAnomaly: await detectAnomaly(newTransaction.amount, newTransaction.description)
    };
    
    setTransactions(prev => [categorizedTransaction, ...prev]);
  };

  const updateBudget = (budgetId, updates) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId ? { ...budget, ...updates } : budget
    ));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions}
            budgets={budgets}
            savingsGoals={savingsGoals}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions}
            onAddTransaction={addTransaction}
          />
        );
      case 'budget':
        return (
          <Budget 
            budgets={budgets}
            transactions={transactions}
            onUpdateBudget={updateBudget}
          />
        );
      case 'insights':
        return (
          <AIInsights 
            transactions={transactions}
            budgets={budgets}
            generateSavingsRecommendation={generateSavingsRecommendation}
          />
        );
      default:
        return <Dashboard transactions={transactions} budgets={budgets} savingsGoals={savingsGoals} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        navigationItems={navigationItems}
      />
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                      currentView === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

export default App;