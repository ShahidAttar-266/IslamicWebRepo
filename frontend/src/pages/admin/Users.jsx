
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  User as UserIcon, 
  Loader2 
} from 'lucide-react';

const AdminUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Shield className="text-primary" size={24} />
          Users Management
        </h1>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-text-muted text-[10px] uppercase tracking-[0.2em]">
                <th className="px-6 py-4 font-black">User Info</th>
                <th className="px-6 py-4 font-black">Role</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                    <Loader2 className="animate-spin mx-auto mb-2 text-primary" />
                    Loading users...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">No users found in database.</td>
                </tr>
              ) : (
                data?.data?.map((user) => (
                  <tr key={user._id} className="hover:bg-bg/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {user.name?.charAt(0).toUpperCase() || <UserIcon size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-text">{user.name}</p>
                          <p className="text-xs text-text-muted flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'admin' ? 'text-primary bg-primary/5 border-primary/20' : 'text-text-muted bg-bg border-border'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {user.isActive ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-tighter">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-danger uppercase tracking-tighter">
                          <XCircle size={12} /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-text-muted font-medium tabular-nums">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
