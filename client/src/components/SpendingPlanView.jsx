import BudgetOverview from './BudgetOverview';
import { Target } from 'lucide-react';

function SpendingPlanView({ budgets, summary, onUpdateBudget }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card-header border-b pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="text-xl flex items-center gap-2 m-0">
          <Target size={24} className="text-primary" /> Budget Management
        </h2>
        <p className="text-muted text-sm mt-2">Set and monitor spending limits for your categories.</p>
      </div>
      
      <div className="max-w-4xl">
        <BudgetOverview budgets={budgets} summary={summary} onUpdateBudget={onUpdateBudget} />
      </div>
    </div>
  );
}

export default SpendingPlanView;
