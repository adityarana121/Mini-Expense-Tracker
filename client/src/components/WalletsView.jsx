import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/format';

function WalletsView() {
  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem('userWallets');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Main Checking', balance: 4500, type: 'Bank' },
      { id: 2, name: 'Savings', balance: 12000, type: 'Bank' },
      { id: 3, name: 'Cash Wallet', balance: 150, type: 'Cash' }
    ];
  });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Bank');

  useEffect(() => {
    localStorage.setItem('userWallets', JSON.stringify(wallets));
  }, [wallets]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (name && balance) {
      setWallets([...wallets, { id: Date.now(), name, balance: parseFloat(balance), type }]);
      setName('');
      setBalance('');
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setWallets(wallets.filter(w => w.id !== id));
  };

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex items-center justify-between" style={{ background: 'var(--primary-color)', color: 'white' }}>
        <div>
          <p className="text-sm opacity-80 mb-1">Total Balance Across Wallets</p>
          <h2 className="text-3xl m-0">{formatCurrency(totalBalance)}</h2>
        </div>
        <Wallet size={48} className="opacity-20" />
      </div>

      <div className="card">
        <div className="card-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="m-0 text-md flex items-center gap-2">
            <CreditCard size={18} className="text-muted"/> Connected Accounts
          </h3>
          <button className="btn-outline text-xs flex items-center gap-1" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> Add Wallet
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="flex gap-4 items-end mb-6 p-4 rounded-lg bg-gray-50 border">
            <div className="flex-1">
              <label className="block text-xs font-bold text-muted mb-1">Wallet Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" placeholder="e.g. Chase Credit" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-muted mb-1">Balance</label>
              <input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} required className="w-full p-2 border rounded" placeholder="0.00" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-muted mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded bg-white">
                <option value="Bank">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <button type="submit" className="btn-primary py-2 px-4 h-10">Save</button>
          </form>
        )}

        <div className="flex flex-col gap-4">
          {wallets.length === 0 ? (
            <p className="text-muted text-center py-4">No wallets added yet.</p>
          ) : (
            wallets.map(wallet => (
              <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f3f4f6', color: 'var(--primary-color)' }}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="m-0 font-bold">{wallet.name}</h4>
                    <p className="m-0 text-xs text-muted">{wallet.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{formatCurrency(wallet.balance)}</span>
                  <button className="text-muted hover:text-danger p-2" onClick={() => handleDelete(wallet.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletsView;
