import React, { useState, useEffect } from 'react';

// --- 1. Category List View ---
const CategoryList = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://budget-tracker-backend-zwaa.onrender.com/api/categories', { credentials: 'include' });
      const data = await response.json();
      setCategories(data);
    } catch (e) { console.error("Failed to fetch categories", e); }
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    await fetch('https://budget-tracker-backend-zwaa.onrender.com/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCat }),
      credentials: 'include'
    });
    setNewCat('');
    fetchCategories();
  };

  const saveEdit = async (id) => {
    await fetch(`https://budget-tracker-backend-zwaa.onrender.com/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editValue }),
      credentials: 'include'
    });
    setEditingId(null);
    fetchCategories();
  };

  return (
    <div className="menu-detail-view" style={{ padding: '20px' }}>
      <button onClick={onClose} style={{ color: '#3498db', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Back</button>
      <h3 style={{ margin: '20px 0' }}>📁 Categories</h3>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Add new..." style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button onClick={handleAddCategory} style={{ background: '#2dce89', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Add</button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            {editingId === cat.id ? (
              <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => saveEdit(cat.id)} autoFocus style={{ border: '1px solid #3498db', padding: '2px 5px' }} />
            ) : (
              <span>{cat.name}</span>
            )}
            <span style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}>✏️</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. Settings View (WITH CURRENCY & RESET) ---
const SettingsView = ({ onClose, onResetData, currency, onCurrencyChange }) => {
  return (
    <div className="menu-detail-view" style={{ padding: '20px' }}>
      <button onClick={onClose} style={{ color: '#3498db', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>← Back</button>
      <h3 style={{ margin: '20px 0' }}>⚙️ Settings</h3>
      
      {/* Currency Selection Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>PREFERENCES</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>App Currency</span>
          <select 
            value={currency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontWeight: 'bold', outline: 'none' }}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Reset Data Section */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '12px', color: '#e11d48', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>DANGER ZONE</label>
        <button 
          onClick={onResetData}
          style={{ width: '100%', padding: '14px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🗑️ Reset All Data
        </button>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', textAlign: 'center' }}>
          This will permanently delete all your transaction history.
        </p>
      </div>
    </div>
  );
};

// --- 3. LEFT SIDEBAR ---
export const LeftSidebar = ({ isOpen, onClose, onViewChange, currentView }) => {
  const options = ['Day', 'Week', 'Month', 'Year', 'All'];
  return (
    <>
      {isOpen && <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 998 }} onClick={onClose} />}
      <div className={`sidebar left ${isOpen ? 'open' : ''}`} style={{ zIndex: 999 }}>
        <div style={{ padding: '20px' }}>
          <h3>Filters</h3>
          {options.map(opt => (
            <button key={opt} className={`filter-btn ${currentView === opt ? 'active' : ''}`} onClick={() => { onViewChange(opt); onClose(); }} style={{ width: '100%', padding: '12px', margin: '8px 0', textAlign: 'left', borderRadius: '10px', border: '1px solid #eee', cursor: 'pointer', background: currentView === opt ? '#3498db' : '#fff', color: currentView === opt ? '#fff' : '#000' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// --- 4. RIGHT SIDEBAR ---
export const RightSidebar = ({ isOpen, onClose, onLogout, onResetData, currency, onCurrencyChange, username }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleFullClose = () => {
    setActiveSubMenu(null);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 998 }} onClick={handleFullClose} />}
      <div className={`sidebar right ${isOpen ? 'open' : ''}`} style={{ zIndex: 999 }}>
        
        {activeSubMenu === 'Categories' ? (
          <CategoryList onClose={() => setActiveSubMenu(null)} />
        ) : activeSubMenu === 'Settings' ? (
          <SettingsView 
            onClose={() => setActiveSubMenu(null)} 
            onResetData={onResetData}
            currency={currency}
            onCurrencyChange={onCurrencyChange}
          />
        ) : (
          <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
              <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '28px', color: 'white', boxShadow: '0 4px 15px rgba(45, 206, 137, 0.3)' }}>
                {username?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: 0 }}>{username}</h3>
              <small style={{ color: '#94a3b8' }}>Member since 2025</small>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="menu-card" onClick={() => setActiveSubMenu('Categories')} style={{ textAlign: 'center', cursor: 'pointer', padding: '20px', border: '1px solid #f1f5f9', borderRadius: '15px', background: '#fff', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>📁</div>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>Categories</div>
              </div>
              <div className="menu-card" onClick={() => setActiveSubMenu('Settings')} style={{ textAlign: 'center', cursor: 'pointer', padding: '20px', border: '1px solid #f1f5f9', borderRadius: '15px', background: '#fff' }}>
                <div style={{ fontSize: '28px', marginBottom: '5px' }}>⚙️</div>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>Settings</div>
              </div>
            </div>

            <button onClick={onLogout} style={{ width: '100%', marginTop: '60px', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#e11d48', fontWeight: 'bold', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};