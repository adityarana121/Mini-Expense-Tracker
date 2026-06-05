import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../utils/format';
import ExpenseChart from './ExpenseChart';
import ExpenseSummary from './ExpenseSummary';

const COLORS = ['#8b5cf6', '#34d399', '#f97316', '#3b82f6', '#ec4899', '#f43f5e'];

function InsightsView({ summary, expenses }) {
  if (!summary) return null;

  const pieData = summary.categoryTotals.map((item) => ({
    name: item.category,
    value: item.total
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <ExpenseChart summary={summary} expenses={expenses} />
        
        <div className="card flex flex-col">
          <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="m-0 text-md text-muted font-normal">Spending by Category</h3>
          </div>
          
          <div style={{ width: '100%', flex: 1, minHeight: '220px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                No categorical data available.
              </div>
            )}
          </div>
          
          {pieData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full">
        <ExpenseSummary summary={summary} />
      </div>
    </div>
  );
}

export default InsightsView;
