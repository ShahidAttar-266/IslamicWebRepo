import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { Trash2, Edit, Search, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminNames = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-names', searchTerm],
    queryFn: async () => {
      const url = searchTerm ? `/names?q=${searchTerm}&limit=100` : '/names?limit=100';
      const res = await api.get(url);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/names/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      queryClient.invalidateQueries({ queryKey: ['names'] });
      queryClient.invalidateQueries({ queryKey: ['recentNames'] });
      toast.success('Name deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete name');
    }
  });

  const addMutation = useMutation({
    mutationFn: (newData) => api.post('/names', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      queryClient.invalidateQueries({ queryKey: ['names'] });
      queryClient.invalidateQueries({ queryKey: ['recentNames'] });
      toast.success('Name added successfully');
      setIsAddModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Failed to add name');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this name?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmitAdd = (data) => {
    addMutation.mutate({
      ...data,
      isPremium: data.isPremium === 'true',
      isActive: true
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Names Management</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text"
              placeholder="Search names..."
              className="w-full bg-card border border-border focus:border-primary rounded-lg py-2 pl-10 pr-4 text-sm text-text outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-opacity-90 text-bg px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <Plus size={16} /> Add Name
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-text-muted text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">English Name</th>
                <th className="px-6 py-4 font-medium">Arabic Name</th>
                <th className="px-6 py-4 font-medium">Gender</th>
                <th className="px-6 py-4 font-medium">Premium</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Loading names...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-muted">No names found.</td>
                </tr>
              ) : (
                data?.data?.map((name) => (
                  <tr key={name._id} className="hover:bg-bg/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-text">{name.nameEnglish}</td>
                    <td className="px-6 py-4 font-arabic text-primary text-xl">{name.nameArabic}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        name.gender === 'boy' ? 'text-blue-400 bg-blue-400/10' : 
                        name.gender === 'girl' ? 'text-pink-400 bg-pink-400/10' : 
                        'text-accent bg-accent/10'
                      }`}>
                        {name.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        name.isPremium ? 'bg-accent/10 text-accent' : 'bg-border text-text-muted'
                      }`}>
                        {name.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-text-muted hover:text-primary transition-colors inline-block" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(name._id)}
                        className="p-2 text-text-muted hover:text-danger transition-colors inline-block" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Name Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text">Add New Name</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="addNameForm" onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">English Name *</label>
                    <input {...register('nameEnglish', { required: true })} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Arabic Name *</label>
                    <input {...register('nameArabic', { required: true })} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none font-arabic text-lg" dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Gender *</label>
                    <select {...register('gender', { required: true })} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2.5 text-text outline-none">
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Is Premium? *</label>
                    <select {...register('isPremium')} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2.5 text-text outline-none">
                      <option value="false">Free</option>
                      <option value="true">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Meaning *</label>
                  <textarea {...register('meaning', { required: true })} rows={2} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Historical Background</label>
                  <textarea {...register('history')} rows={3} className="w-full bg-bg border border-border focus:border-primary rounded-lg px-4 py-2 text-text outline-none"></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border bg-bg/30 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg font-medium text-text hover:bg-bg transition-colors">
                Cancel
              </button>
              <button type="submit" form="addNameForm" disabled={isSubmitting} className="bg-primary hover:bg-opacity-90 text-bg px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Name'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNames;