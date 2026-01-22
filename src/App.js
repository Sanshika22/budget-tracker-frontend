import React, { useState, useEffect, useCallback } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseItem from './ExpenseItem'; 
import LoginForm from './LoginForm'; 
import RegistrationForm from './RegistrationForm'; 
import IncomeExpenseChart from './IncomeExpenseChart';
import ExpenseChart from './ExpenseChart'; 
import ReportGenerator from './ReportGenerator';
import GoalTracker from './GoalTracker'; 
import BudgetModule from './BudgetModule'; 
import { LeftSidebar, RightSidebar } from './Sidebars'; 
import './App.css'; 

function App() {
  const [user, setUser] = useState(null); 
  const [authMode, setAuthMode] = useState('login'); 
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Month');

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [savingsGoal, setSavingsGoal] = useState(0); 
  const [budgetLimits, setBudgetLimits] = useState({});
  const [currency, setCurrency] = useState(localStorage.getItem('buddy_currency') || 'INR');

  
  const API_BASE = "https://budget-tracker-backend-zwaa.onrender.com/api";

  const getDateRangeLabel = () => {
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    if (timeFilter === 'Day') return now.toLocaleDateString('en-GB', options);
    if (timeFilter === 'Week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return `${sevenDaysAgo.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${now.toLocaleDateString('en-GB', options)}`;
    }
    if (timeFilter === 'Month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return `${firstDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${lastDay.toLocaleDateString('en-GB', options)}`;
    }
    if (timeFilter === 'Year') return `01 Jan ${now.getFullYear()} - 31 Dec ${now.getFullYear()}`;
    return "All Time Records";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency', 
      currency: currency, 
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('buddy_currency', newCurrency);
  };

  // ✅ Sticky Data Logic [cite: 2025-12-17]
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const expRes = await fetch(`${API_BASE}/expenses`, { credentials: 'include' });
      
      if (expRes.status === 401) { 
        setUser(null); 
        setLoading(false);
        return; 
      }
      
      if (!expRes.ok) throw new Error("Backend connection error");

      const expData = await expRes.json();
      setExpenses(expData);

      const catRes = await fetch(`${API_BASE}/categories`, { credentials: 'include' });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.map(c => c.name)); 
      }

      const setRes = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
      if (setRes.ok) {
        const setData = await setRes.json();
        setSavingsGoal(setData.savings_goal ?? 0);
        setBudgetLimits(setData.budget_limits ?? {});
      }
      setError(null);
    } catch (e) {
      setError("System Offline. Check server connection.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const saveSettingsToServer = async (newGoal, newLimits) => {
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savings_goal: newGoal, budget_limits: newLimits }),
        credentials: 'include'
      });
    } catch (e) { console.error("Failed to save sticky settings", e); }
  };

  const handleUpdateGoal = (newGoal) => {
    setSavingsGoal(newGoal);
    saveSettingsToServer(newGoal, budgetLimits);
  };

  const handleUpdateLimits = (newLimits) => {
    setBudgetLimits(newLimits);
    saveSettingsToServer(savingsGoal, newLimits);
  };

  const handleResetData = async () => {
    if(!window.confirm("Are you sure? This will delete all history!")) return;
    try {
      const response = await fetch(`${API_BASE}/expenses/reset`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        alert("All transactions cleared!");
        fetchData(); 
        setRightOpen(false); 
      }
    } catch (e) { console.error(e); }
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = (exp.description || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (exp.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (timeFilter === 'All') return true;
    const expDate = new Date(exp.date);
    const now = new Date();
    if (timeFilter === 'Day') return expDate.toDateString() === now.toDateString();
    if (timeFilter === 'Week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return expDate >= weekAgo && expDate <= now;
    }
    if (timeFilter === 'Month') return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    if (timeFilter === 'Year') return expDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalIncome = filteredExpenses.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = filteredExpenses.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0); 
  const remainingBudget = totalIncome - totalExpenses;

  const handleAuthSuccess = (username) => {
    setUser(username);
    setAuthMode('login'); 
    fetchData(); 
  };
  
  const handleLogout = async () => {
    try { await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' }); } 
    finally { 
        setUser(null); 
        setExpenses([]); 
        setBudgetLimits({}); 
        setSavingsGoal(0);
        setCategories([]);
        setRightOpen(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete transaction?`)) return;
    try {
      const response = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  return (
    <div className="App">
      <header className="main-header">
        {user ? (
          <>
            <button onClick={() => setLeftOpen(true)} className="icon-btn">☰</button>
            <div className="header-title" style={{ flex: 1, textAlign: 'center' }}>
              {isSearching ? (
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="header-search-input"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => { if(searchTerm === "") setIsSearching(false); }}
                />
              ) : (
                <>
                  <span>Buddy--x</span><br/>
                  <small>{user}'s Wallet</small>
                </>
              )}
            </div>
            <div className="header-icons" style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => setIsSearching(!isSearching)} className="icon-btn">
                {isSearching ? '✕' : '🔍'}
              </button>
              <button onClick={() => setRightOpen(true)} className="icon-btn">⋮</button>
            </div>
          </>
        ) : (
          <h1>💰 Buddy--x Tracker</h1>
        )}
      </header>
      
      {!user ? (
        <div className="auth-wrapper">
          <div className="auth-tabs">
            <button onClick={() => setAuthMode('login')} className={authMode === 'login' ? 'active' : ''}>Login</button>
            <button onClick={() => setAuthMode('register')} className={authMode === 'register' ? 'active' : ''}>Register</button>
          </div>
          <div className="auth-content">
            {authMode === 'login' && <LoginForm onLoginSuccess={handleAuthSuccess} onSwitchToSignup={() => setAuthMode('register')} />}
            {authMode === 'register' && <RegistrationForm onRegisterSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode('login')} />}
          </div>
        </div>
      ) : (
        <main className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {error && <div className="error-banner">{error}</div>}
          
          <div style={{ 
            textAlign: 'center', margin: '20px 0', color: '#FF6600', fontSize: '15px', fontWeight: '800',
            background: '#FFF0E6', padding: '8px 25px', borderRadius: '30px', boxShadow: '0 2px 8px rgba(255,102,0,0.1)'
          }}>
            📅 {getDateRangeLabel()}
          </div>

          <div className="stats-grid" style={{ width: '100%' }}>
            <div className="stat-card income"><label>Income</label><h3>+ {formatCurrency(totalIncome)}</h3></div>
            <div className="stat-card expenses"><label>Expenses</label><h3>- {formatCurrency(totalExpenses)}</h3></div>
            <div className="stat-card balance"><label>Balance</label><h3>{formatCurrency(remainingBudget)}</h3></div>
          </div>

          <div className="planning-grid" style={{ width: '100%' }}>
            <GoalTracker goal={savingsGoal} currentSavings={remainingBudget} onUpdate={handleUpdateGoal} />
            <BudgetModule limits={budgetLimits} expenses={filteredExpenses} onUpdate={handleUpdateLimits} categories={categories} formatCurrency={formatCurrency} />
          </div>

          <div className="visual-grid" style={{ width: '100%' }}>
            <IncomeExpenseChart expenses={filteredExpenses} />
            <ExpenseChart expenses={filteredExpenses} />
          </div>

          <div className="report-row" style={{ width: '100%', padding: '0 5%' }}>
            <ReportGenerator expenses={filteredExpenses} totalBalance={remainingBudget} />
          </div>

          <section className="form-section" style={{ width: '100%' }}>
            <AddExpenseForm onExpenseAdded={fetchData} categories={categories} /> 
          </section>
          
          <section className="history-section" style={{ width: '100%' }}>
            <h2>📜 {searchTerm ? `Search Results: ${searchTerm}` : `Transaction History (${timeFilter})`}</h2>
            {loading ? (
              <div className="loader">Updating dashboard...</div>
            ) : (
              <div className="table-container">
                {filteredExpenses.length > 0 ? (
                  <table className="expense-table">
                    <thead>
                      <tr><th>Date</th><th>Description</th><th>Amount</th><th>Category</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <ExpenseItem key={expense.id} expense={expense} onDelete={handleDelete} onUpdate={fetchData} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                ) : <p className="empty-msg">No transactions found.</p>}
              </div>
            )}
          </section>
        </main>
      )}

      <LeftSidebar isOpen={leftOpen} onClose={() => setLeftOpen(false)} onViewChange={setTimeFilter} currentView={timeFilter} />
      
      <RightSidebar 
        isOpen={rightOpen} 
        onClose={() => setRightOpen(false)} 
        onLogout={handleLogout} 
        onResetData={handleResetData}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        username={user} 
      />
    </div>
  );
}

export default App;