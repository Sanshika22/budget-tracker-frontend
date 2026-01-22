import React from 'react';

export const LeftSidebar = ({ isOpen, onClose, onViewChange, currentView }) => {
  const options = ['Day', 'Week', 'Month', 'Year', 'All', 'Interval'];
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}
      <div className={`sidebar left ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="visa-badge">VISA</div>
          <div>
            <strong>Payment card</strong><br/>
            <small>INR</small>
          </div>
        </div>
        <div className="sidebar-content">
          {options.map(opt => (
            <button key={opt} className={`filter-btn ${currentView === opt ? 'active' : ''}`} onClick={() => { onViewChange(opt); onClose(); }}>
              {opt}
            </button>
          ))}
          <button className="filter-btn date-picker-btn">
             <span>📅</span> Choose date
          </button>
        </div>
      </div>
    </>
  );
};

export const RightSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { label: 'Categories', icon: '📖' },
    { label: 'Accounts', icon: '👛' },
    { label: 'Currencies', icon: '💲' },
    { label: 'Settings', icon: '⚙️' }
  ];
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}
      <div className={`sidebar right ${isOpen ? 'open' : ''}`}>
        <div className="right-menu">
          {menuItems.map(item => (
            <div key={item.label} className="menu-item" onClick={onClose}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};