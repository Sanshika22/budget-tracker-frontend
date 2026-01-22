import React, { useState } from 'react';

const GoalTracker = ({ goal, currentSavings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal || 0);

  const percentage = goal > 0 ? Math.min((currentSavings / goal) * 100, 100) : 0;

  const handleSave = () => {
    onUpdate(Number(tempGoal));
    setIsEditing(false);
  };

  return (
    <div className="goal-tracker card" style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold' }}>MONTHLY SAVINGS GOAL</h4>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                value={tempGoal} 
                onChange={(e) => setTempGoal(e.target.value)}
                style={{ fontSize: '24px', width: '150px', border: '1px solid #3498db', borderRadius: '5px' }}
              />
              <button onClick={handleSave} style={{ padding: '5px 10px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
            </div>
          ) : (
            <h2 style={{ margin: 0, fontSize: '32px', cursor: 'pointer' }} onClick={() => { setTempGoal(goal); setIsEditing(true); }}>
              ₹{goal?.toLocaleString() || 0}
            </h2>
          )}
        </div>
        <div style={{ background: '#e8f0fe', color: '#3f51b5', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
          {Math.round(percentage)}% ACHIEVED
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <small style={{ color: '#bdc3c7' }}>Progress</small>
          <small style={{ fontWeight: 'bold' }}>{Math.round(percentage)}%</small>
        </div>
        <div style={{ height: '8px', background: '#f1f2f6', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: '#3f51b5', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>
      {!isEditing && <small style={{ color: '#95a5a6', display: 'block', marginTop: '10px' }}>💡 Click the amount to change your goal</small>}
    </div>
  );
};

export default GoalTracker;