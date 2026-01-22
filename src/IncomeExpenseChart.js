import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const IncomeExpenseChart = ({ expenses }) => {
  // Group and sum only expenses (negative amounts) by category
  const categoryData = expenses
    .filter(e => e.amount < 0)
    .reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});

  const data = Object.keys(categoryData).map(key => ({
    name: key,
    amount: categoryData[key]
  })).sort((a, b) => b.amount - a.amount); // Sort high to low

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="stat-card" style={{ height: '350px', background: 'white' }}>
      <label style={{ color: '#64748b', fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '15px' }}>
        SPENDING BY CATEGORY (₹)
      </label>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={35}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;