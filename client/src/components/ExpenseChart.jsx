import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Using brighter, more vibrant colors for better contrast on dark mode
const COLORS = ['#b5179e', '#4cc9f0', '#fee440', '#f72585', '#7209b7', '#4361ee'];

const ExpenseChart = ({ summary }) => {
  if (!summary || summary.categoryTotals.length === 0) return null;

  return (
    <div className="glass-panel" style={{ height: '350px' }}>
      <h3 className="text-xl title-gradient mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={summary.categoryTotals}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            label={(props) => {
              const { cx, cy, midAngle, outerRadius, name, percent } = props;
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 20;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text x={x} y={y} fill="#ffffff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14}>
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {summary.categoryTotals.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
            contentStyle={{ backgroundColor: 'rgba(30, 30, 35, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
