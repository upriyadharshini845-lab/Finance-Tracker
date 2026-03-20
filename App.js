import React, { useState, useRef, useEffect } from 'react';
import { TransactionProvider } from './context/TransactionContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import BudgetGoals from './components/budget/BudgetGoals';
import LoginPage from './components/auth/LoginPage';
import './App.css';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 80) setActivePage('transactions');
    if (diff < -80) setActivePage('dashboard');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>💰</div>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading FinTrack...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'budget', label: 'Budget', icon: '🎯' },
  ];

  return (
    <TransactionProvider>
      <DashboardProvider>
        <div className="app">

          {/* ===== MOBILE HEADER ===== */}
          <div className="mobile-header">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="mobile-brand">
              <span>💰</span>
              <span>FinTrack</span>
            </div>
            <button
              className="hamburger-btn"
              onClick={toggleTheme}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* ===== SIDEBAR OVERLAY ===== */}
          <div
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* ===== SIDEBAR ===== */}
          <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-brand">
              <span className="brand-icon">💰</span>
              <span className="brand-name">FinTrack</span>
            </div>
            <nav className="sidebar-nav">
              {pages.map((p) => (
                <button
                  key={p.id}
                  className={`nav-item ${activePage === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setActivePage(p.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="nav-icon">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                👤 {user.name}
              </p>
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
              >
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <button
                onClick={logout}
                style={{
                  marginTop: 8,
                  width: '100%',
                  padding: '7px',
                  background: 'var(--danger-glow)',
                  color: 'var(--danger)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'var(--font-body)',
                }}
              >
                🚪 Logout
              </button>
            </div>
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <main
            className="main-content swipe-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            {/* ===== WELCOME BANNER ===== */}
            {showWelcome && activePage === 'dashboard' && (
              <div style={{
                margin: '20px 32px 0',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'slideUp 0.5s ease',
                boxShadow: '0 4px 20px rgba(99,102,241,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}>
                    👋
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      Welcome back, {user.name}!
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}>
                      Here is your financial overview for today 🚀
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: 18,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* ===== PAGES ===== */}
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'transactions' && <Transactions />}
            {activePage === 'budget' && <BudgetGoals />}

          </main>

          {/* ===== BOTTOM NAV ===== */}
          <div className="bottom-nav">
            {pages.map((p) => (
              <button
                key={p.id}
                className={`bottom-nav-item ${activePage === p.id ? 'active' : ''}`}
                onClick={() => setActivePage(p.id)}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

        </div>
      </DashboardProvider>
    </TransactionProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;