import { formatCurrency } from '../utils/format';
import { Target, TrendingUp, RefreshCw, Car, Home } from 'lucide-react';

function ExpenseSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Goals Card Mock */}
      <div className="card">
        <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="m-0 text-md flex items-center gap-2">
            <Target size={18} className="text-muted" /> Goals
          </h3>
          <span className="text-sm text-muted cursor-pointer hover:text-main font-bold" onClick={() => alert('Advanced goals tracking coming soon!')}>See all &gt;</span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-wrapper" style={{ width: 36, height: 36, background: '#f8f9fc', color: '#10b981' }}>
                <Home size={16} />
              </div>
              <span className="font-bold text-sm">House Deposit</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold">$5,800 <span className="text-muted font-normal">/ $10,000</span></div>
              <div className="text-sm font-bold text-success">58%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-wrapper" style={{ width: 36, height: 36, background: '#f8f9fc', color: '#f97316' }}>
                <Car size={16} />
              </div>
              <span className="font-bold text-sm">New Car</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold">$1,450 <span className="text-muted font-normal">/ $5,000</span></div>
              <div className="text-sm font-bold text-orange-500" style={{ color: 'var(--accent-orange)' }}>29%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights / Recurring Card */}
      <div className="card">
        <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="m-0 text-md flex items-center gap-2">
            <TrendingUp size={18} className="text-muted" /> Spending Highlights
          </h3>
          <span className="text-sm text-muted cursor-pointer hover:text-main font-bold">See all &gt;</span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-wrapper" style={{ width: 36, height: 36, background: '#f8f9fc', color: '#ef4444' }}>
                <TrendingUp size={16} />
              </div>
              <span className="font-bold text-sm">Highest Expense</span>
            </div>
            <div className="text-sm font-bold">
              {summary.highestExpense ? formatCurrency(summary.highestExpense.amount) : '$0.00'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-wrapper" style={{ width: 36, height: 36, background: '#f8f9fc', color: '#8b5cf6' }}>
                <RefreshCw size={16} />
              </div>
              <span className="font-bold text-sm">Active Categories</span>
            </div>
            <div className="text-sm font-bold">
              {summary.categoryTotals?.length || 0}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default ExpenseSummary;
