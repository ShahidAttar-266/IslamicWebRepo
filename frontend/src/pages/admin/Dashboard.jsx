
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { 
  Users, 
  Database, 
  Upload, 
  Shield, 
  Loader2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';


const AdminDashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 min
  });

  const stats = [
    { name: 'Total Users', value: analytics?.totalUsers || 0, icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Names', value: analytics?.totalNames || 0, icon: <Database size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'New Users (Month)', value: analytics?.newUsersThisMonth || 0, icon: <Plus size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-text-muted font-medium">Crunching analytics...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-text mb-2">Welcome Back, Admin</h1>
        <p className="text-text-muted italic">Here's what's happening with IslamicNames today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Live</span>
            </div>
            <p className="text-sm font-bold text-text-muted mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-text">Recent Uploads</h2>
              <p className="text-xs text-text-muted">Latest bulk name additions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {analytics?.recentUploads?.length > 0 ? (
              analytics.recentUploads.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border/50">
                  <div>
                    <p className="font-bold text-sm text-text">{log.fileName}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">
                      {new Date(log.createdAt).toLocaleDateString()} • {log.successCount} names added
                    </p>
                  </div>
                  <div className="text-emerald-500">
                    <Shield size={16} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted italic py-10 text-center">No recent uploads found.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/upload" className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-border hover:border-primary transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Upload size={18} />
                  </div>
                  <span className="text-sm font-bold text-text">Bulk Upload</span>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/users" className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-border hover:border-primary transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-bold text-text">Manage Users</span>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/names" className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-border hover:border-primary transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                    <Database size={18} />
                  </div>
                  <span className="text-sm font-bold text-text">Review Names</span>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 text-center">
             <Shield className="text-primary mx-auto mb-4" size={32} />
             <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Security Note</p>
             <p className="text-xs text-text-muted leading-relaxed">
               All manual database changes are logged. Ensure you verify data accuracy before activating names.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
