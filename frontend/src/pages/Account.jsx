import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Mail, Save } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 py-4 md:py-10 px-4">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-text mb-2">My Profile</h1>
        <p className="text-sm md:text-base text-text-muted italic">Manage your account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Profile Card */}
        <div className="col-span-1">
          <div className="bg-card border border-border rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 text-center shadow-2xl h-full flex flex-col justify-center items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl md:text-3xl border border-primary/20">
              {user?.name?.charAt(0).toUpperCase() || <UserIcon size={40} />}
            </div>
            <h2 className="text-xl font-bold text-text mb-1 truncate w-full">{user?.name}</h2>
            <p className="text-xs md:text-sm text-text-muted truncate w-full italic">{user?.email}</p>
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
