import React, { useState } from 'react';

// Syncing categories with your updated AddExpenseForm list
const CATEGORIES = ['Eating Out', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Transport','Health','Sports','Gifts', 'Salary', 'Other'];

// Helper for Indian Rupee Formatting
const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

function ExpenseItem({ expense, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(expense.description || '');
  const [editedAmount, setEditedAmount] = useState(Math.abs(expense.amount).toFixed(2));
  const [editedCategory, setEditedCategory] = useState(expense.category);
  const [editedDate, setEditedDate] = useState(expense.date);
  const [isIncome, setIsIncome] = useState(expense.amount > 0);
  
  const API_URL = 'https://budget-tracker-backend-zwaa.onrender.com/api/expenses';

  const handleEditSave = async () => {
    if (!editedDescription || !editedAmount || !editedCategory || !editedDate) {
      alert('Please fill in all fields before saving.');
      return;
    }
    
    // Logic: Force negative for expenses, positive for income
    const floatVal = parseFloat(editedAmount);
    const finalAmount = isIncome ? Math.abs(floatVal) : -Math.abs(floatVal);

    const updatedExpense = {
      description: editedDescription,
      amount: finalAmount,
      category: editedCategory,
      date: editedDate,
    };

    try {
      const response = await fetch(`${API_URL}/${expense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExpense),
        credentials: 'include', 
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      setIsEditing(false);
      onUpdate(); 
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update.");
    }
  };
  
  const isNegative = expense.amount < 0;
  
  // Build the display string using the formatter
  const amountDisplay = rupeeFormatter.format(Math.abs(expense.amount));
  
  const amountStyle = { 
    color: isNegative ? '#e74c3c' : '#2ecc71', 
    fontWeight: 'bold',
    fontSize: '1.05em'
  };
  
  return (
    <tr style={{ 
      borderBottom: '1px solid #eee',
      backgroundColor: isEditing ? '#fcfcfc' : 'transparent' 
    }}>
      {/* Date Column */}
      <td style={{ padding: '12px' }}>
        {isEditing ? (
          <input 
            type="date" 
            value={editedDate} 
            onChange={(e) => setEditedDate(e.target.value)} 
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        ) : (
          new Date(expense.date).toLocaleDateString('en-IN')
        )}
      </td>
      
      {/* Description Column */}
      <td style={{ padding: '12px' }}>
        {isEditing ? (
          <input 
            type="text" 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)} 
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        ) : (
          <strong>{expense.description}</strong>
        )}
      </td>
      
      {/* Amount and Type Logic */}
      <td style={{ padding: '12px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ fontSize: '12px' }}>
              <label>
                <input type="radio" checked={!isIncome} onChange={() => setIsIncome(false)} /> Debit
              </label>
              <label style={{ marginLeft: '10px' }}>
                <input type="radio" checked={isIncome} onChange={() => setIsIncome(true)} /> Credit
              </label>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '5px', fontSize: '12px', fontWeight: 'bold' }}>₹</span>
              <input 
                type="number" 
                value={editedAmount} 
                onChange={(e) => setEditedAmount(e.target.value)} 
                style={{ width: '90px', padding: '5px 5px 5px 15px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </div>
        ) : (
          <span style={amountStyle}>
            {isNegative ? '- ' : '+ '} {amountDisplay}
          </span>
        )}
      </td>
      
      {/* Category Column */}
      <td style={{ padding: '12px' }}>
        {isEditing ? (
          <select 
            value={editedCategory} 
            onChange={(e) => setEditedCategory(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        ) : (
          <span style={{ 
            background: '#f1f2f6', 
            padding: '4px 10px', 
            borderRadius: '15px', 
            fontSize: '12px',
            color: '#34495e'
          }}>
            {expense.category}
          </span>
        )}
      </td>
      
      {/* Actions Column */}
      <td style={{ padding: '12px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={handleEditSave} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
            <button onClick={() => setIsEditing(false)} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setIsEditing(true)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              title="Edit"
            >
              ✏️
            </button>
            <button 
              onClick={() => onDelete(expense.id)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default ExpenseItem;