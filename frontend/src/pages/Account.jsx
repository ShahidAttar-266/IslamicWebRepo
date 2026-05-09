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
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
          <Crown size={14} /> Premium Pro
        </span>
      );
    }
    if (status === 'basic') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
          <Shield size={14} /> Basic Plan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-text-muted/10 text-text-muted rounded-full text-xs font-black uppercase tracking-widest border border-border">
        Free Tier
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 py-4 md:py-10 px-4">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-text mb-2">My Profile</h1>
        <p className="text-sm md:text-base text-text-muted italic">Manage your account settings and subscription status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Plan Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 text-center shadow-2xl">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl md:text-3xl border border-primary/20">
              {user?.name?.charAt(0).toUpperCase() || <UserIcon size={40} />}
            </div>
            <h2 className="text-xl font-bold text-text mb-1 truncate">{user?.name}</h2>
            <p className="text-xs md:text-sm text-text-muted mb-5 truncate italic">{user?.email}</p>
            {getPlanBadge()}
          </div>

          <div className="bg-bg border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Subscription Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-text-muted font-medium">Status</span>
                <span className="font-bold capitalize text-text">{user?.subscription?.status || 'Free'}</span>
              </div>
              {user?.subscription?.startDate && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">Since</span>
                  <span className="font-bold text-text flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {new Date(user.subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {user?.subscription?.status === 'free' && (
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full mt-6 bg-accent hover:bg-opacity-90 text-bg py-3.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-accent/20 uppercase tracking-widest min-h-[44px]"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl">
            <h2 className="text-lg md:text-xl font-black text-text mb-8 uppercase tracking-wider">Personal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-3">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-text rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all font-bold text-base"
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-bg/50 border border-border text-text-muted/60 rounded-xl py-3.5 pl-11 pr-4 outline-none cursor-not-allowed font-bold text-base"
                  />
                </div>
                <p className="text-[10px] text-text-muted mt-3 italic font-medium">Email address cannot be changed currently.</p>
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending || name === user?.name}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-bg px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20 min-h-[48px]"
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