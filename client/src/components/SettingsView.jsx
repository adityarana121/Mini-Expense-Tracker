import { useState } from 'react';
import { User, Save } from 'lucide-react';

function SettingsView({ profile, setProfile }) {
  const [name, setName] = useState(profile.name);
  const [initials, setInitials] = useState(profile.initials);

  const handleSave = (e) => {
    e.preventDefault();
    const newProfile = { name, initials };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    alert('Settings saved successfully!');
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-header border-b pb-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="text-xl flex items-center gap-2 m-0">
          <User size={24} className="text-primary" /> Profile Settings
        </h2>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-bold text-muted mb-2">Display Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full p-3 rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--border-color)' }}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-muted mb-2">Avatar Initials</label>
          <input 
            type="text" 
            value={initials} 
            onChange={e => setInitials(e.target.value.toUpperCase().slice(0, 2))} 
            className="w-full p-3 rounded-lg border focus:outline-none"
            style={{ borderColor: 'var(--border-color)' }}
            placeholder="JD"
            maxLength={2}
            required
          />
          <p className="text-xs text-muted mt-2">Max 2 characters. Used for your profile badge.</p>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary flex items-center gap-2 justify-center w-full">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsView;
