import React, { useState } from 'react';

const AddExpenseForm = ({ onExpenseAdded, categories = [] }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('expense'); // ✅ Default 'expense'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return alert("Please fill amount and category");

    // ✅ Logic: Agar expense hai toh minus, agar income hai toh plus
    const finalAmount = type === 'expense' ? parseFloat(amount) * -1 : parseFloat(amount);

    const payload = {
      amount: finalAmount,
      description,
      category,
      date
    };

    try {
      const res = await fetch('https://budget-tracker-backend-zwaa.onrender.com/api/expenses',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      if (res.ok) {
        setAmount('');
        setDescription('');
        setCategory('');
        onExpenseAdded(); 
      } else {
        alert("Failed to add transaction");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit} style={{ padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '20px' }}>
      <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>➕ Add Transaction</h3>
      
      {/* ✅ Income/Expense Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          type="button" 
          onClick={() => setType('expense')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'expense' ? '#fecdd3' : '#f1f5f9', color: type === 'expense' ? '#e11d48' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Expense
        </button>
        <button 
          type="button" 
          onClick={() => setType('income')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: type === 'income' ? '#dcfce7' : '#f1f5f9', color: type === 'income' ? '#16a34a' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Income
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} 
        />
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input 
          type="text" 
          placeholder="e.g. Salary, Rent, Dinner" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} 
        />
        
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} 
        />
      </div>
      
      <button 
        type="submit" 
        style={{ 
          width: '100%', marginTop: '15px', padding: '14px', 
          background: type === 'expense' ? '#e11d48' : '#2dce89', 
          color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    </form>
  );
};

export default AddExpenseForm;