import React from 'react';
import { formatCurrency } from '../utils/format';
import { TrendingUp, Award, DollarSign } from 'lucide-react';

const ExpenseSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="glass-panel flex items-center gap-4">
        <div className="btn-icon" style={{ background: 'rgba(42, 157, 143, 0.2)', color: 'var(--success-color)' }}>
          <DollarSign size={32} />
        </div>
        <div>
          <h3 className="text-muted text-sm mb-1">Total This Month</h3>
          <p className="text-2xl font-bold">{formatCurrency(summary.totalThisMonth)}</p>
        </div>
      </div>

      <div className="glass-panel flex items-center gap-4">
        <div className="btn-icon" style={{ background: 'rgba(123, 44, 191, 0.2)', color: 'var(--primary-hover)' }}>
          <Award size={32} />
        </div>
        <div>
          <h3 className="text-muted text-sm mb-1">Highest Single Expense</h3>
          <p className="text-xl font-bold">
            {summary.highestExpense ? formatCurrency(summary.highestExpense.amount) : '-'}
          </p>
          <p className="text-xs text-muted">
            {summary.highestExpense ? summary.highestExpense.category : ''}
          </p>
        </div>
      </div>

      <div className="glass-panel flex items-center gap-4">
        <div className="btn-icon" style={{ background: 'rgba(230, 57, 70, 0.2)', color: 'var(--danger-color)' }}>
          <TrendingUp size={32} />
        </div>
        <div>
          <h3 className="text-muted text-sm mb-1">Top Category</h3>
          <p className="text-xl font-bold">
            {summary.categoryTotals.length > 0 
              ? [...summary.categoryTotals].sort((a, b) => b.total - a.total)[0].category 
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
