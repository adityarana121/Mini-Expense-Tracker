import { useState, useEffect } from 'react';
import { Bell, Search, LayoutDashboard, Wallet, Activity, PieChart, Target, Settings, LogOut, Download } from 'lucide-react';
import api from './utils/api';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';
import BudgetOverview from './components/BudgetOverview';

// New Modules
import SettingsView from './components/SettingsView';
import WalletsView from './components/WalletsView';
import InsightsView from './components/InsightsView';
import SpendingPlanView from './components/SpendingPlanView';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Interactive States
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandTransactions, setExpandTransactions] = useState(false);

  // Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'Administrator', initials: 'AD' };
  });

  useEffect(() => {
    fetchData();
  }, [categoryFilter, dateRangeFilter]);

  const fetchData = async () => {
    try {
      let queryUrl = '/expenses';
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      
      if (dateRangeFilter === 'This Month') {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        params.append('startDate', start);
      } else if (dateRangeFilter === 'Last Month') {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        const end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        params.append('startDate', start);
        params.append('endDate', end);
      }
      
      const queryString = params.toString();
      if (queryString) queryUrl += `?${queryString}`;

      const [expensesRes, summaryRes, budgetsRes] = await Promise.all([
        api.get(queryUrl),
        api.get('/expenses/summary'),
        api.get('/budgets')
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
      setBudgets(budgetsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveExpense = async (data) => {
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      fetchData();
      setShowForm(false);
      setEditingExpense(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchData();
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return;
    
    const headers = ['Date,Category,Amount,Note'];
    const rows = filteredExpenses.map(ex => {
      const formattedDate = ex.date;
      const amount = ex.amount;
      const note = ex.note ? `"${ex.note.replace(/"/g, '""')}"` : '';
      return `${formattedDate},${ex.category},${amount},${note}`;
    });
    
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = expenses.filter(ex => 
    ex.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ex.note && ex.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const SidebarLink = ({ icon: Icon, label }) => {
    const isActive = activeTab === label;
    return (
      <div 
        onClick={() => { setActiveTab(label); setExpandTransactions(false); setShowForm(false); setEditingExpense(null); }}
        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" 
        style={isActive ? { background: '#f3f4f6', color: 'var(--text-main)', fontWeight: 'bold' } : { color: 'var(--text-muted)' }}
      >
        <Icon size={20} />
        <span>{label}</span>
      </div>
    );
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'Settings':
        return <SettingsView profile={profile} setProfile={setProfile} />;
      case 'Wallets & Banks':
        return <WalletsView />;
      case 'Insights':
        return <InsightsView summary={summary} expenses={filteredExpenses} />;
      case 'Activity Log':
        return (
          <div className="card">
            <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="m-0 text-md flex items-center gap-2">
                <Activity size={18} className="text-muted"/> Complete Activity Log
              </h3>
              <button className="btn-outline text-xs flex items-center gap-1" onClick={handleExportCSV}>
                <Download size={14}/> Export CSV
              </button>
            </div>
            <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        );
      case 'Spending Plan':
        return (
          <SpendingPlanView 
            budgets={budgets} 
            summary={summary} 
            onUpdateBudget={(c, a) => api.post('/budgets', { category: c, amount: a }).then(fetchData)} 
          />
        );
      case 'Overview':
      default:
        return (
          <>
            {showForm && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '0 20px', position: 'relative' }}>
                  <ExpenseForm 
                    initialData={editingExpense}
                    onSubmit={handleSaveExpense} 
                    onCancel={() => { setShowForm(false); setEditingExpense(null); }} 
                  />
                </div>
              </div>
            )}

            {!expandTransactions ? (
              <>
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  <BudgetOverview budgets={budgets} summary={summary} onUpdateBudget={(c, a) => {
                    api.post('/budgets', { category: c, amount: a }).then(fetchData);
                  }} />
                  <ExpenseChart summary={summary} expenses={expenses} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <ExpenseSummary summary={summary} />
                  <div className="card">
                    <div className="card-header">
                      <h3 className="m-0 text-md flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-muted"/> Transactions
                      </h3>
                      <div className="flex gap-2 items-center">
                        <button className="btn-icon" onClick={handleExportCSV} title="Export CSV">
                          <Download size={16}/>
                        </button>
                        <span className="text-sm text-muted cursor-pointer hover:text-main font-bold" onClick={() => setExpandTransactions(true)}>See all &gt;</span>
                      </div>
                    </div>
                    <ExpenseList expenses={filteredExpenses.slice(0, 5)} onDelete={handleDelete} onEdit={handleEdit} />
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <h3 className="m-0 text-md flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-muted"/> Search Results
                  </h3>
                  <div className="flex gap-2">
                    <button className="btn-outline text-xs flex items-center gap-1" onClick={handleExportCSV}>
                      <Download size={14}/> Export
                    </button>
                    <button className="btn-outline text-xs" onClick={() => { setExpandTransactions(false); setSearchQuery(''); }}>
                      Back to Dashboard
                    </button>
                  </div>
                </div>
                <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} onEdit={handleEdit} />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setActiveTab('Overview')}>
            <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '8px', color: 'white' }}>
              <Wallet size={20} />
            </div>
            <h2 className="text-xl font-bold m-0" style={{ fontSize: '1.1rem' }}>Expense Tracker</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarLink icon={LayoutDashboard} label="Overview" />
            <SidebarLink icon={Wallet} label="Wallets & Banks" />
            <SidebarLink icon={Activity} label="Activity Log" />
            <SidebarLink icon={PieChart} label="Insights" />
            <SidebarLink icon={Target} label="Spending Plan" />
          </nav>
        </div>

        <div>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3 text-muted cursor-pointer hover:text-main" onClick={() => alert('Help & Support is coming soon!')}>
              <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', border: '2px solid currentColor', borderRadius: '50%', justifyContent: 'center' }}>?</div>
              <span className="text-sm font-bold">Help & Support</span>
            </div>
            <div className="flex items-center gap-3 text-muted cursor-pointer hover:text-main" onClick={() => setActiveTab('Settings')}>
              <Settings size={20} />
              <span className="text-sm font-bold" style={activeTab === 'Settings' ? { color: 'var(--text-main)' } : {}}>Settings</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-8 border-t pt-6" style={{ borderColor: 'var(--border-color)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff7043', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {profile.initials}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm m-0">{profile.name}</p>
            </div>
            <div className="text-muted cursor-pointer">
              ▾
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content relative">
        <header className="dashboard-header">
          <div className="flex gap-4">
            <div className="search-bar">
              <Search size={18} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setActiveTab('Overview'); setExpandTransactions(true); }}
                style={{ width: '150px' }}
              />
            </div>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '99px', padding: '0.5rem 2.5rem 0.5rem 1rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={dateRangeFilter} 
              onChange={(e) => setDateRangeFilter(e.target.value)}
              style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '99px', padding: '0.5rem 2.5rem 0.5rem 1rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Time</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button className="btn-primary" onClick={() => { setActiveTab('Overview'); setEditingExpense(null); setShowForm(!showForm); setExpandTransactions(false); }}>
              {showForm ? 'Cancel' : '+ Add Expense'}
            </button>
            <div 
              className="p-2 rounded-full border cursor-pointer border-gray-200 hover:bg-gray-50"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-muted" />
            </div>
            
            {showNotifications && (
              <div className="card" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', zIndex: 50, width: '250px', padding: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <p className="text-sm text-muted m-0 text-center">No new notifications</p>
              </div>
            )}
          </div>
        </header>

        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;
