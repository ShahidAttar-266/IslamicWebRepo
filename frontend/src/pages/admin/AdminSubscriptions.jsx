import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const AdminSubscriptions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const res = await api.get('/admin/subscriptions');
      return res.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Subscriptions Management</h1>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-text-muted text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">User Email</th>
                <th className="px-6 py-4 font-medium">Plan Type</th>
                <th className="px-6 py-4 font-medium">Billing Cycle</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-text-muted">Loading subscriptions...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-text-muted">No active subscriptions.</td>
                </tr>
              ) : (
                data?.data?.map((sub) => (
                  <tr key={sub._id} className="hover:bg-bg/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-text">{sub.userId?.email || 'N/A'}</td>
                    <td className="px-6 py-4 capitalize">{sub.planType}</td>
                    <td className="px-6 py-4 capitalize">{sub.billingCycle}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        sub.status === 'active' ? 'text-primary bg-primary/10' : 
                        sub.status === 'cancelled' ? 'text-danger bg-danger/10' :
                        'text-accent bg-accent/10'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(sub.endDate).toLocaleDateString()}
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

export default AdminSubscriptions;