import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CreditCard, Target, Brain, X, Home } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import AIInsights from './components/AIInsights';
import LoginForm from './components/auth/LoginForm';
import { useAI } from './hooks/useAI';
import { mockData } from './data/mockData';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SavvySpend AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return children;
};

// Authentication Page Component
const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SavvySpend AI</h1>
            <p className="text-gray-600 text-sm">Your AI-powered financial companion</p>
          </div>

          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : mode === 'login' ? (
            <LoginForm 
              onToggleMode={handleToggleMode}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignUpForm onToggleMode={handleToggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for SignUp and ForgotPassword
const SignUpForm = ({ onToggleMode }) => (
  <div className="text-center">
    <h2 className="text-xl font-semibold mb-4">Create Account</h2>
    <p className="text-gray-600 mb-4">Sign up functionality will be available soon!</p>
    <p className="text-sm text-gray-500 mb-4">For now, please use the demo account to explore SavvySpend AI.</p>
    <button
      onClick={onToggleMode}
      className="text-purple-600 hover:text-purple-500 font-medium"
    >
      Back to Sign In
    </button>
  </div>
);

const ForgotPasswordForm = ({ onBack }) => (
  <div className="text-center">
    <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
    <p className="text-gray-600 mb-4">Password reset functionality will be available soon!</p>
    <p className="text-sm text-gray-500 mb-4">Please use the demo account for now.</p>
    <button
      onClick={onBack}
      className="text-purple-600 hover:text-purple-500 font-medium"
    >
      Back to Sign In
    </button>
  </div>
);

// Main App Layout Component
const AppLayout = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [transactions, setTransactions] = useState(mockData.transactions);
  const [budgets, setBudgets] = useState(mockData.budgets);
  const [savingsGoals] = useState(mockData.savingsGoals);
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
};

// Root App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
