import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Plus, Crown, ArrowLeftRight } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const ComparisonRow = ({ label, val1, val2, isArabic = false }) => (
  <div className="grid grid-cols-3 border-b border-border/50 py-4 items-center group hover:bg-primary/[0.02] transition-colors">
    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</div>
    <div className={`px-4 font-bold text-text ${isArabic ? 'font-arabic text-2xl text-primary' : 'text-sm'}`}>{val1 || '-'}</div>
    <div className={`px-4 font-bold text-text ${isArabic ? 'font-arabic text-2xl text-primary' : 'text-sm'}`}>{val2 || '-'}</div>
  </div>
);

const EmptySlot = ({ slot, onAdd }) => (
  <button 
    onClick={onAdd}
    className="flex flex-col items-center justify-center p-12 bg-bg/50 border-2 border-dashed border-border rounded-[2rem] hover:border-primary/50 hover:bg-primary/5 transition-all group h-full w-full"
  >
    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Plus size={24} />
    </div>
    <p className="font-bold text-text-muted">Add Name {slot}</p>
  </button>
);

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'premium';

  useEffect(() => {
    if (!isPremium) {
      toast.error('Name Comparison is a Premium feature', { icon: '👑' });
      navigate('/pricing');
    }
  }, [isPremium, navigate]);

  const { data: name1 } = useQuery({
    queryKey: ['name', id1],
    queryFn: async () => {
      if (!id1) return null;
      const res = await api.get(`/names/${id1}`);
      return res.data.data;
    },
    enabled: !!id1
  });

  const { data: name2 } = useQuery({
    queryKey: ['name', id2],
    queryFn: async () => {
      if (!id2) return null;
      const res = await api.get(`/names/${id2}`);
      return res.data.data;
    },
    enabled: !!id2
  });

  const removeName = (slot) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(slot === 1 ? 'id1' : 'id2');
    setSearchParams(newParams);
  };

  const handleAdd = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/search?${params.toString()}`);
  };

  if (!isPremium) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
          <Crown size={14} /> Premium Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text">Compare Names</h1>
        <p className="text-text-muted max-w-xl mx-auto italic">Analyze meanings, origins, and historical contexts side-by-side to find the perfect choice.</p>
      </div>

      {/* Comparison Grid */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        {/* Header Headers */}
        <div className="grid grid-cols-3 bg-bg/50 border-b border-border p-8 items-end gap-8">
          <div className="flex items-center gap-3 text-primary">
            <ArrowLeftRight size={32} strokeWidth={2.5} />
          </div>
          
          <div className="relative">
            {name1 ? (
              <div className="text-center space-y-3">
                <button onClick={() => removeName(1)} className="absolute -top-4 -right-4 p-1.5 bg-danger/10 text-danger rounded-full hover:bg-danger hover:text-bg transition-all">
                  <X size={14} />
                </button>
                <div className="font-arabic text-5xl text-primary">{name1.nameArabic}</div>
                <div className="text-2xl font-black text-text">{name1.nameEnglish}</div>
              </div>
            ) : <EmptySlot slot={1} onAdd={handleAdd} />}
          </div>

          <div className="relative">
            {name2 ? (
              <div className="text-center space-y-3">
                <button onClick={() => removeName(2)} className="absolute -top-4 -right-4 p-1.5 bg-danger/10 text-danger rounded-full hover:bg-danger hover:text-bg transition-all">
                  <X size={14} />
                </button>
                <div className="font-arabic text-5xl text-primary">{name2.nameArabic}</div>
                <div className="text-2xl font-black text-text">{name2.nameEnglish}</div>
              </div>
            ) : <EmptySlot slot={2} onAdd={handleAdd} />}
          </div>
        </div>

        {/* Comparison Body */}
        <div className="p-8">
          <ComparisonRow label="Meaning" val1={name1?.meaning} val2={name2?.meaning} />
          <ComparisonRow label="Origin" val1={name1?.origin} val2={name2?.origin} />
          <ComparisonRow label="Gender" val1={name1?.gender} val2={name2?.gender} />
          <ComparisonRow label="Pronunciation" val1={name1?.pronunciation} val2={name2?.pronunciation} />
          <ComparisonRow label="Quranic" 
            val1={name1?.isQuranic ? '✦ Yes' : 'No'} 
            val2={name2?.isQuranic ? '✦ Yes' : 'No'} 
          />
          <ComparisonRow label="Arabic Root" 
            val1={name1?.arabicRoot || 'ح م د'} 
            val2={name2?.arabicRoot || 'ع ل ي'} 
            isArabic 
          />
          
          <div className="grid grid-cols-3 py-8 items-start">
            <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">History</div>
            <div className="px-4 text-xs leading-loose text-text-muted border-r border-border/30 h-full">
              {name1?.history || 'Upgrade to see full history...'}
            </div>
            <div className="px-4 text-xs leading-loose text-text-muted">
              {name2?.history || 'Upgrade to see full history...'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
         <button onClick={() => navigate('/search')} className="bg-primary hover:bg-opacity-90 text-bg px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            Find More Names
         </button>
         <button onClick={() => window.print()} className="bg-card border border-border hover:border-primary text-text px-8 py-3 rounded-xl font-bold transition-all">
            Print Comparison
         </button>
      </div>
    </div>
  );
};

export default Compare;