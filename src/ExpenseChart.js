import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function ExpenseChart({ expenses }) {
  // --- SAFETY CHECK ---
  // If there are no expenses, show a friendly message instead of crashing
  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Spending Breakdown</h3>
        <p>No data to display. Add your first expense to see the chart!</p>
      </div>
    );
  }

  // 1. Filter out only negative amounts (deductions)
  const expenseData = expenses.filter(item => item.amount < 0);

  // If there are only income entries (like salary) but no expenses yet
  if (expenseData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Spending Breakdown</h3>
        <p>No deductions recorded yet. Add an expense to see your spending map.</p>
      </div>
    );
  }

  // 2. Group expenses by category
  const dataMap = expenseData.reduce((acc, curr) => {
    const category = curr.category;
    const amount = Math.abs(curr.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // 3. Convert to format Recharts needs
  const chartData = Object.keys(dataMap).map(key => ({
    name: key,
    value: dataMap[key]
  }));

  return (
    <div style={{ width: '100%', height: 350, marginTop: '20px', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
      <h3 style={{ textAlign: 'center' }}>Spending Breakdown</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              // FIX: Changed COLORS.COLORS.length to COLORS.length
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;