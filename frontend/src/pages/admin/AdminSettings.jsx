import { useState } from 'react';
import { Save, Shield, Globe, Bell, CreditCard } from 'lucide-react';
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
      <div className="flex justify-between items-center">
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
        {/* API Configuration */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-bg/30 flex items-center gap-3">
            <Shield className="text-primary" size={20} />
            <h2 className="font-bold text-text">API & Security Keys</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Razorpay Key ID</label>
                <input type="text" placeholder="rzp_test_..." className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Razorpay Key Secret</label>
                <input type="password" placeholder="••••••••••••••••" className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">SendGrid API Key</label>
              <input type="password" placeholder="SG.••••••••" className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
            </div>
          </div>
        </section>

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
              <input type="email" defaultValue="support@islamicnames.com" className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 text-xs uppercase tracking-wider">Site Description (SEO)</label>
              <textarea rows={3} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none text-sm resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Subscription Toggles */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-bg/30 flex items-center gap-3">
            <CreditCard className="text-primary" size={20} />
            <h2 className="font-bold text-text">Subscription Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
              <div>
                <p className="font-medium text-text text-sm">Allow Guest Preview</p>
                <p className="text-xs text-text-muted">Let non-logged in users see limited name details</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-bg rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
              <div>
                <p className="font-medium text-text text-sm">Enable Yearly Discount</p>
                <p className="text-xs text-text-muted">Show the -20% badge on the pricing page</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-bg rounded-full shadow"></div>
              </div>
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
              <label htmlFor="email_notif" className="text-sm text-text">Receive email alerts for new premium subscriptions</label>
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