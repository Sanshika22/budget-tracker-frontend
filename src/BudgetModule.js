import React, { useState } from 'react';

const BudgetModule = ({ limits, expenses, onUpdate, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimits, setTempLimits] = useState({ ...limits });

  // Jab Edit Limits dabayein toh purani limits load ho jayein
  const handleEditClick = () => {
    setTempLimits({ ...limits });
    setIsEditing(true);
  };

  // Nayi limits save karne ke liye
  const handleSave = () => {
    onUpdate(tempLimits); // Yeh App.js ke handleUpdateLimits ko call karega
    setIsEditing(false);
  };

  return (
    <div className="budget-module" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>📊 Category Budgets</h3>
        {!isEditing ? (
          <button onClick={handleEditClick} style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Edit Limits
          </button>
        ) : (
          <button onClick={handleSave} style={{ padding: '8px 15px', background: '#2dce89', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save All
          </button>
        )}
      </div>
      
      <div className="budget-bars" style={{ display: 'grid', gap: '20px' }}>
        {categories.map(category => {
          const spent = expenses
            .filter(e => e.category === category && e.amount < 0)
            .reduce((sum, e) => sum + Math.abs(e.amount), 0);
          
          const limit = limits[category] || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

          return (
            <div key={category} className="budget-item">
              <div className="budget-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600' }}>{category}</span>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>₹</span>
                    <input 
                      type="number" 
                      value={tempLimits[category] || ''} 
                      onChange={(e) => setTempLimits({ ...tempLimits, [category]: parseFloat(e.target.value) || 0 })}
                      style={{ width: '80px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                ) : (
                  <span style={{ color: '#666' }}>₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}</span>
                )}
              </div>
              
              {!isEditing && (
                <div className="progress-bar-bg" style={{ height: '10px', background: '#edf2f7', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      height: '100%', 
                      width: `${percent}%`, 
                      background: percent > 90 ? '#e11d48' : '#2dce89',
                      transition: 'width 0.5s ease'
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isEditing && (
        <button 
          onClick={() => setIsEditing(false)} 
          style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default BudgetModule;