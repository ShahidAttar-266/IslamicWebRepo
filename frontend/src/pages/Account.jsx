import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Mail, Shield, Save, Crown, Calendar } from 'lucide-react';

const Account = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/auth/me', data);
      return res.data;
    },
    onSuccess: (data) => {
      updateUser(data.data);
      queryClient.invalidateQueries(['auth']);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }
    updateProfileMutation.mutate({ name });
  };

  const getPlanBadge = () => {
    const status = user?.subscription?.status || 'free';
    if (status === 'premium') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
          <Crown size={14} /> Premium Pro
        </span>
      );
    }
    if (status === 'basic') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
          <Shield size={14} /> Basic Plan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-text-muted/10 text-text-muted rounded-full text-xs font-black uppercase tracking-widest border border-border">
        Free Tier
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-text mb-2">My Profile</h1>
        <p className="text-text-muted italic">Manage your account settings and subscription.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Plan Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-6 text-center shadow-lg shadow-primary/5">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-black text-3xl">
              {user?.name?.charAt(0).toUpperCase() || <UserIcon size={40} />}
            </div>
            <h2 className="text-xl font-bold text-text mb-1 truncate">{user?.name}</h2>
            <p className="text-sm text-text-muted mb-4 truncate">{user?.email}</p>
            {getPlanBadge()}
          </div>

          <div className="bg-bg/50 border border-border rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Subscription Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Status</span>
                <span className="font-bold capitalize text-text">{user?.subscription?.status || 'Free'}</span>
              </div>
              {user?.subscription?.startDate && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Since</span>
                  <span className="font-medium text-text flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(user.subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {user?.subscription?.status === 'free' && (
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-bg py-2 rounded-xl font-bold text-xs transition-all shadow-md shadow-amber-500/20 uppercase tracking-widest"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl shadow-primary/5">
            <h2 className="text-xl font-bold text-text mb-6">Personal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg border border-border focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-xl py-3 pl-11 pr-4 outline-none transition-all font-medium"
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-muted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-bg/50 border border-border text-text-muted rounded-xl py-3 pl-11 pr-4 outline-none opacity-70 cursor-not-allowed font-medium"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2 italic">Email address cannot be changed currently.</p>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending || name === user?.name}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto ml-auto bg-primary hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed text-bg px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;