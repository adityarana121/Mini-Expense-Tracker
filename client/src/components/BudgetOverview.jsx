import React, { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { Target, Check, Edit2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const BudgetOverview = ({ budgets, summary, onUpdateBudget }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (category, currentAmount) => {
    setEditingCategory(category);
    setEditValue(currentAmount ? currentAmount.toString() : '');
  };

  const handleSave = async (category) => {
    const val = parseFloat(editValue);
    if (isNaN(val) || val < 0) return;
    
    setIsSubmitting(true);
    await onUpdateBudget(category, val);
    setIsSubmitting(false);
    setEditingCategory(null);
  };

  // Convert summary category totals array to map for easy lookup
  const currentSpending = (summary?.categoryTotals || []).reduce((acc, curr) => {
    acc[curr.category] = curr.total;
    return acc;
  }, {});

  const budgetMap = budgets.reduce((acc, curr) => {
    acc[curr.category] = curr.amount;
    return acc;
  }, {});

  return (
    <div className="glass-panel mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-primary" style={{ color: 'var(--primary-color)' }} />
        <h3 className="text-xl title-gradient m-0">Monthly Budgets</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {CATEGORIES.map(category => {
          const limit = budgetMap[category] || 0;
          const spent = currentSpending[category] || 0;
          const isExceeded = limit > 0 && spent > limit;
          const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isEditing = editingCategory === category;

          return (
            <div key={category} className="budget-item">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{category}</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      placeholder="0.00"
                      className="w-24 p-1 text-sm"
                      autoFocus
                    />
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--success-color)' }}
                      onClick={() => handleSave(category)}
                      disabled={isSubmitting}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">
                      {formatCurrency(spent)} / {limit > 0 ? formatCurrency(limit) : 'No limit'}
                    </span>
                    <button 
                      className="btn-icon p-1" 
                      onClick={() => handleEditClick(category, limit)}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="progress-bg">
                <div 
                  className={`progress-bar ${isExceeded ? 'exceeded' : ''}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              {isExceeded && (
                <p className="text-xs text-danger mt-1">Budget exceeded by {formatCurrency(spent - limit)}!</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverview;
