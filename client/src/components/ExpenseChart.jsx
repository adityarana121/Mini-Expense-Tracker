import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../utils/format';

function ExpenseChart({ summary, expenses = [] }) {
  if (!summary || expenses.length === 0) {
    return (
      <div className="card flex items-center justify-center h-full text-muted">
        No spending data for this month.
      </div>
    );
  }

  const total = summary.totalThisMonth || 0;
  
  // Group expenses by date (Not cumulative, just daily totals)
  const expensesByDate = expenses.reduce((acc, curr) => {
    const dateStr = curr.date.split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + curr.amount;
    return acc;
  }, {});

  const sortedDates = Object.keys(expensesByDate).sort();
  
  const data = sortedDates.map(date => {
    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      amount: expensesByDate[date]
    };
  });

  return (
    <div className="card flex flex-col">
      <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="m-0 text-md text-muted font-normal mb-1">Spending this month</h3>
          <h2 className="text-2xl m-0">{formatCurrency(total)}</h2>
        </div>
        <button className="btn-outline text-xs text-muted border-none p-0">
          This month vs. last month ▾
        </button>
      </div>

      <div className="flex gap-4 text-xs font-bold mb-6 mt-2">
        <div className="flex items-center gap-2">
          <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: 'var(--primary-color)' }}></div>
          <span>Daily Spend</span>
        </div>
      </div>

      <div style={{ width: '100%', height: '220px', flex: 1 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f5" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8e8e93' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8e8e93' }} tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                const colors = ['#8b5cf6', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#ec4899', '#8b5cf6'];
                return (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
