import React from 'react';
import { Menu, Brain, Bell, Search } from 'lucide-react';

const Header = ({ currentView, onViewChange, onToggleMobileMenu, navigationItems }) => {
  const getCurrentViewTitle = () => {
    const view = navigationItems.find(item => item.id === currentView);
    return view ? view.label : 'Dashboard';
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white hidden sm:block">SavvySpend AI</h1>
            </div>
          </div>

          {/* Center Section - Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">U</span>
              </div>
              <span className="text-white font-medium hidden sm:block">User</span>
            </div>
          </div>
        </div>

        {/* Mobile View Title */}
        <div className="lg:hidden pb-3">
          <h2 className="text-xl font-semibold text-white">{getCurrentViewTitle()}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
