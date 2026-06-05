import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';
import BudgetOverview from './components/BudgetOverview';
import { fetchExpenses, fetchSummary, createExpense, updateExpense, deleteExpense, fetchBudgets, upsertBudget } from './utils/api';
import { Plus } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
  });

  const loadData = useCallback(async () => {
    try {
      const [expensesData, summaryData, budgetsData] = await Promise.all([
        fetchExpenses(filters),
        fetchSummary(),
        fetchBudgets()
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateBudget = async (category, amount) => {
    try {
      await upsertBudget(category, amount);
      loadData();
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await createExpense(data);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
    loadData();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  return (
    <div className="app-container">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl title-gradient m-0">Mini Expense Tracker</h1>
          <p className="text-muted">Keep track of your daily spending</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          disabled={isFormOpen && !editingExpense}
        >
          <Plus size={20} /> Add Expense
        </button>
      </header>

      <main>
        <ExpenseSummary summary={summary} />
        
        <BudgetOverview 
          budgets={budgets} 
          summary={summary} 
          onUpdateBudget={handleUpdateBudget} 
        />

        {isFormOpen && (
          <div className="mb-8" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <ExpenseForm 
              initialData={editingExpense} 
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingExpense(null);
              }}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <div className="lg:col-span-1">
            <ExpenseChart summary={summary} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
