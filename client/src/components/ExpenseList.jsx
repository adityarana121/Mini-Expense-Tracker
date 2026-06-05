import React from 'react';
import { formatCurrency, formatDate } from '../utils/format';
import { Edit2, Trash2, ArrowDownToLine } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const ExpenseList = ({ expenses, onEdit, onDelete, filters, setFilters }) => {
  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(e => `${e.date},${e.category},${e.amount},"${e.note || ''}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl title-gradient m-0">Recent Expenses</h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <select 
            value={filters.category} 
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            aria-label="Filter by category"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            aria-label="Start Date"
          />
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            aria-label="End Date"
          />
          
          <button 
            className="btn-icon" 
            onClick={handleExportCSV} 
            title="Export to CSV"
            aria-label="Export to CSV"
          >
            <ArrowDownToLine size={20} />
          </button>
        </div>
      </div>

      <div className="table-container">
        {expenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span className="badge">{expense.category}</span>
                  </td>
                  <td className="text-muted">{expense.note || '-'}</td>
                  <td className="text-right font-bold">{formatCurrency(expense.amount)}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button 
                        className="btn-icon" 
                        onClick={() => onEdit(expense)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        style={{ color: 'var(--danger-color)' }}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this expense?')) {
                            onDelete(expense.id);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-muted">
            No expenses found. Try adjusting your filters or add a new expense.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
