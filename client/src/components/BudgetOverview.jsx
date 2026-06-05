import { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { LayoutDashboard } from 'lucide-react';

function BudgetOverview({ budgets, summary, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
  const COLORS = ['#8b5cf6', '#10b981', '#f97316', '#f59e0b', '#3b82f6', '#ec4899'];

  const getCategorySpend = (category) => {
    if (!summary || !summary.categoryTotals) return 0;
    const cat = summary.categoryTotals.find(c => c.category === category);
    return cat ? cat.total : 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editCategory && editAmount) {
      onUpdateBudget(editCategory, parseFloat(editAmount));
      setIsEditing(false);
      setEditCategory('');
      setEditAmount('');
    }
  };

  return (
    <div className="card">
      <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="m-0 text-md text-muted font-normal mb-1">Total budgets</h3>
          <h2 className="text-2xl m-0">{formatCurrency(totalBudget)}</h2>
        </div>
        <button className="btn-outline text-xs" onClick={() => setIsEditing(!isEditing)}>
          Expenses ▾
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="mb-6 p-4 rounded-xl" style={{ background: '#f8f9fc', border: '1px solid var(--border-color)' }}>
          <div className="flex flex-col gap-3">
            <select 
              value={editCategory} 
              onChange={e => setEditCategory(e.target.value)}
              required
              style={{ background: 'white' }}
            >
              <option value="">Select Category...</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
            <input 
              type="number" 
              value={editAmount} 
              onChange={e => setEditAmount(e.target.value)}
              placeholder="Budget Amount ($)"
              min="0"
              step="0.01"
              required
              style={{ background: 'white' }}
            />
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Save Budget
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <h4 className="text-xs text-muted mb-2 font-bold">Allocation</h4>
        <div className="progress-segmented-container">
          {budgets.length > 0 ? budgets.map((budget, idx) => {
            const percentage = (budget.amount / totalBudget) * 100;
            return (
              <div 
                key={budget.category} 
                className="progress-segment" 
                style={{ width: `${percentage}%`, background: COLORS[idx % COLORS.length] }}
                title={`${budget.category}: ${formatCurrency(budget.amount)}`}
              ></div>
            );
          }) : <div className="progress-segment" style={{ width: '100%', background: '#e5e7eb' }}></div>}
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-6">
        {budgets.length === 0 ? (
          <p className="text-muted text-sm text-center">No budgets set.</p>
        ) : (
          budgets.map((budget, idx) => {
            const spent = getCategorySpend(budget.category);
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            const isExceeded = percentage > 100;
            
            return (
              <div key={budget.category} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[idx % COLORS.length] }}></div>
                  <div>
                    <h5 className="m-0 text-sm">{budget.category}</h5>
                    <p className={`m-0 text-xs mt-1 ${isExceeded ? 'text-danger font-bold' : 'text-muted'}`}>
                      -{formatCurrency(spent)} spent
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h5 className="m-0 text-sm font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                    {formatCurrency(budget.amount)} <span className="text-muted font-normal text-xs">({percentage.toFixed(1)}%)</span>
                  </h5>
                  <p className="m-0 text-xs text-muted mt-1">
                    Budget {formatCurrency(budget.amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BudgetOverview;
