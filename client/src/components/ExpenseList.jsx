import { formatCurrency } from '../utils/format';
import { ShoppingBag, Coffee, Car, Film, Home, FileText, Trash2, Edit2 } from 'lucide-react';

function ExpenseList({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <p>No expenses found. Start adding some!</p>
      </div>
    );
  }

  const getCategoryDetails = (category) => {
    switch (category) {
      case 'Food': return { icon: <Coffee size={18} color="#f97316" />, label: 'Essential' };
      case 'Transport': return { icon: <Car size={18} color="#8b5cf6" />, label: 'Occasional' };
      case 'Entertainment': return { icon: <Film size={18} color="#f59e0b" />, label: 'Lifestyle' };
      case 'Bills': return { icon: <Home size={18} color="#10b981" />, label: 'Essential' };
      case 'Shopping': return { icon: <ShoppingBag size={18} color="#ec4899" />, label: 'Lifestyle' };
      default: return { icon: <FileText size={18} color="#6b7280" />, label: 'Other' };
    }
  };

  return (
    <div className="flex-col">
      {expenses.map((expense) => {
        const details = getCategoryDetails(expense.category);
        return (
          <div key={expense.id} className="list-item hover:bg-gray-50 -mx-6 px-6 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="icon-wrapper" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                {details.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm m-0" style={{ color: 'var(--text-main)' }}>
                  {expense.category}
                </h4>
                {expense.note && (
                  <p className="text-xs text-muted m-0 mt-0.5">
                    {expense.note}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-xs text-muted hidden sm:block">
                {details.label}
              </div>
              <div className="text-right w-20">
                <p className="font-bold text-sm m-0" style={{ color: 'var(--danger-color)' }}>
                  -{formatCurrency(expense.amount)}
                </p>
              </div>
              <div className="text-xs text-muted w-16 text-right">
                {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </div>
              
              <div className="flex gap-1">
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(expense); }} 
                    className="btn-icon" 
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }} 
                    className="btn-icon text-danger" 
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
