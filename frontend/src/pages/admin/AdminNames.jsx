import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { 
  Trash2, 
  Edit, 
  Search, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminNames = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-names', searchTerm, page],
    queryFn: async () => {
      const url = `/names?q=${searchTerm}&limit=50&page=${page}&sort=nameEnglish`;
      const res = await api.get(url);
      return res.data;
    },
    placeholderData: (prev) => prev
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/names/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      toast.success('Name deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete name');
    }
  });

  const saveMutation = useMutation({
    mutationFn: (formData) => {
      if (editingName) {
        return api.put(`/names/${editingName._id}`, formData);
      }
      return api.post('/names', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-names'] });
      toast.success(editingName ? 'Name updated successfully' : 'Name added successfully');
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to save name');
    }
  });

  const handleEdit = (name) => {
    setEditingName(name);
    setIsModalOpen(true);
    reset({
      nameEnglish: name.nameEnglish,
      nameArabic: name.nameArabic,
      nameUrdu: name.nameUrdu || '',
      gender: name.gender,
      isQuranic: name.isQuranic?.toString() || 'false',
      meaning: name.meaning,
      origin: name.origin || '',
      pronunciation: name.pronunciation || '',
      history: name.history || '',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingName(null);
    reset();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this name? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (formData) => {
    const formattedData = {
      ...formData,
      isQuranic: formData.isQuranic === 'true',
      isActive: true
    };
    saveMutation.mutate(formattedData);
  };

  const totalPages = Math.ceil((data?.total || data?.count || 0) / 50) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Names Management</h1>
          <p className="text-sm text-text-muted italic">Manage the database of names.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text"
              placeholder="Search by name or meaning..."
              className="w-full bg-card border border-border focus:border-primary rounded-xl py-2.5 pl-10 pr-4 text-sm text-text outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingName(null);
              reset({
                nameEnglish: '',
                nameArabic: '',
                nameUrdu: '',
                gender: 'boy',
                isQuranic: 'false',
                meaning: '',
                origin: '',
                pronunciation: '',
                history: '',
              });
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-opacity-90 text-bg px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <Plus size={18} /> Add Name
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">English Name</th>
                <th className="px-6 py-5">Arabic & Urdu</th>
                <th className="px-6 py-5">Gender</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <p className="text-text-muted font-bold text-sm">Fetching names...</p>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-text-muted italic">No names found in the database.</td>
                </tr>
              ) : (
                data?.data?.map((name) => (
                  <tr key={name._id} className="hover:bg-bg/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-text">{name.nameEnglish}</div>
                      <div className="text-[10px] text-text-muted truncate max-w-[150px]">{name.meaning}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-arabic text-primary text-2xl leading-none">{name.nameArabic}</span>
                        {name.nameUrdu && <span className="text-xs text-text-muted mt-1">{name.nameUrdu}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        name.gender === 'boy' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' : 
                        name.gender === 'girl' ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : 
                        'text-purple-500 bg-purple-500/10 border-purple-500/20'
                      }`}>
                        {name.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {name.isQuranic && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Quranic
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button 
                        onClick={() => handleEdit(name)}
                        className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all" 
                        title="Edit Name"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(name._id)}
                        className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all" 
                        title="Delete Name"
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
        
        {/* Pagination */}
        {!isLoading && data?.data?.length > 0 && (
          <div className="px-6 py-5 bg-bg/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Showing <span className="text-text">{(page - 1) * 50 + 1}</span> - <span className="text-text">{Math.min(page * 50, data?.total || data?.count || 0)}</span> of <span className="text-text">{data?.total || data?.count || 0}</span> Names
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-card border border-border rounded-xl text-text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-black">
                  {page}
                </span>
                <span className="text-text-muted text-xs font-bold px-1">of</span>
                <span className="px-3 py-1 bg-bg border border-border rounded-lg text-xs font-black text-text-muted">
                  {totalPages}
                </span>
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 bg-card border border-border rounded-xl text-text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-bg/90 backdrop-blur-md" onClick={handleCloseModal}></div>
          
          <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border bg-bg/20">
              <div>
                <h2 className="text-xl font-black text-text uppercase tracking-tight">
                  {editingName ? 'Update Name Details' : 'Add New Name'}
                </h2>
                <p className="text-xs text-text-muted italic">Fields marked with * are required.</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-bg rounded-xl text-text-muted transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form id="nameForm" onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">English Name *</label>
                  <input 
                    {...register('nameEnglish', { required: 'English name is required' })} 
                    className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-bold outline-none transition-all" 
                    placeholder="e.g. Muhammad"
                  />
                  {errors.nameEnglish && <p className="text-danger text-[10px] font-bold mt-1 uppercase">{errors.nameEnglish.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Arabic Name *</label>
                  <input 
                    {...register('nameArabic', { required: 'Arabic name is required' })} 
                    className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-arabic text-2xl outline-none transition-all" 
                    dir="rtl"
                    placeholder="محمد"
                  />
                  {errors.nameArabic && <p className="text-danger text-[10px] font-bold mt-1 uppercase">{errors.nameArabic.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Urdu Name</label>
                  <input 
                    {...register('nameUrdu')} 
                    className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-bold outline-none transition-all" 
                    dir="rtl"
                    placeholder="محمد"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Gender *</label>
                  <select {...register('gender', { required: true })} className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3.5 text-text font-bold outline-none cursor-pointer">
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Is Quranic? *</label>
                  <select {...register('isQuranic')} className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3.5 text-text font-bold outline-none cursor-pointer">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Meaning *</label>
                <textarea 
                  {...register('meaning', { required: 'Meaning is required' })} 
                  rows={2} 
                  className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-medium outline-none transition-all resize-none italic"
                  placeholder="The praised one, commendable..."
                ></textarea>
                {errors.meaning && <p className="text-danger text-[10px] font-bold mt-1 uppercase">{errors.meaning.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Origin</label>
                  <input {...register('origin')} className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-bold outline-none" placeholder="Arabic" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Pronunciation</label>
                  <input {...register('pronunciation')} className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-bold outline-none" placeholder="Mu-HAM-mad" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Historical Background</label>
                <textarea {...register('history')} rows={4} className="w-full bg-bg border border-border focus:border-primary rounded-xl px-4 py-3 text-text font-medium outline-none transition-all resize-none text-sm" placeholder="Detailed historical context..."></textarea>
              </div>
            </form>
            
            <div className="p-6 border-t border-border bg-bg/30 flex flex-col sm:flex-row justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal} 
                className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-text-muted hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="nameForm" 
                disabled={isSubmitting} 
                className="bg-primary hover:bg-opacity-90 text-bg px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingName ? 'Update Name' : 'Create Name'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNames;