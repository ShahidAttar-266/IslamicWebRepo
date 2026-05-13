import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Users, Database, CreditCard, TrendingUp, Upload, Shield, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const AdminDashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data.data;
    }
  });

  const stats = [
    { name: 'Total Users', value: analytics?.totalUsers || 0, icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Subscribers', value: analytics?.activeSubscribers || 0, icon: <CreditCard size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Total Names', value: analytics?.totalNames || 0, icon: <Database size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Monthly Revenue', value: `₹${analytics?.monthlyRevenue || 0}`, icon: <TrendingUp size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-text">Revenue Overview</h2>
              <p className="text-xs text-text-muted">Projected monthly earnings (last 6 months)</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={12} /> Real-time
            </div>
          </div>
          
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.revenueByMonth || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DB87A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2DB87A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontWeight: 800
                  }}
                  itemStyle={{ color: '#2DB87A' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2DB87A" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
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
               All manual database changes are logged. Ensure you verify premium uploads before activating.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
