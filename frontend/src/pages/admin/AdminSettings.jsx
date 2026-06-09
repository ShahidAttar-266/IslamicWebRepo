import { useState } from 'react';
import { Save, Globe, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Admin Settings</h1>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-primary hover:bg-opacity-90 text-bg px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Site Metadata */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-bg/30 flex items-center gap-3">
            <Globe className="text-primary" size={20} />
            <h2 className="font-bold text-text">Site Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Site Name</label>
              <input type="text" defaultValue="Islamic Baby Names" className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Contact Email</label>
              <input type="email" defaultValue="islamicnameshelp@gmail.com" className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Site Description (SEO)</label>
              <textarea rows={3} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* System Notifications */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-bg/30 flex items-center gap-3">
            <Bell className="text-primary" size={20} />
            <h2 className="font-bold text-text">Admin Notifications</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="email_notif" defaultChecked className="w-4 h-4 rounded border-border bg-bg text-primary focus:ring-primary" />
              <label htmlFor="email_notif" className="text-sm text-text">Receive email alerts for new signups</label>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <p className="text-xs text-text-muted italic">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminSettings;