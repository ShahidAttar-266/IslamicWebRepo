"use client";
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { X, Plus, Printer, Search } from 'lucide-react';

import api from '@/api/axios';

const ComparisonRow = ({ label, val1, val2, isArabic = false }) => (
  <div className="border-b border-border/50 py-6 md:py-4">
    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 md:hidden text-center">{label}</div>
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8">
      <div className="hidden md:block text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</div>
      <div className="flex flex-col md:block text-center md:text-left">
        <span className="md:hidden text-[9px] font-bold text-text-muted uppercase mb-1">Name 1</span>
        <div className={`px-2 md:px-4 font-medium text-text ${isArabic ? 'font-arabic text-2xl text-primary' : 'text-sm md:text-base'}`}>
          {val1 || <span className="text-text-muted opacity-30 italic">-</span>}
        </div>
      </div>
      <div className="flex flex-col md:block text-center md:text-left border-t border-border/20 pt-4 md:pt-0 md:border-t-0">
        <span className="md:hidden text-[9px] font-bold text-text-muted uppercase mb-1">Name 2</span>
        <div className={`px-2 md:px-4 font-medium text-text ${isArabic ? 'font-arabic text-2xl text-primary' : 'text-sm md:text-base'}`}>
          {val2 || <span className="text-text-muted opacity-30 italic">-</span>}
        </div>
      </div>
    </div>
  </div>
);

const EmptySlot = ({ slot, onAdd }) => (
  <button 
    onClick={onAdd}
    className="flex flex-col items-center justify-center p-8 md:p-12 bg-bg/50 border-2 border-dashed border-border rounded-3xl hover:border-primary/50 hover:bg-primary/5 transition-all group h-full w-full min-h-[160px]"
  >
    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Plus size={24} />
    </div>
    <p className="font-bold text-xs md:text-sm text-text-muted">Add Name {slot}</p>
  </button>
);

const CompareContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const navigate = (path) => router.push(path);

  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

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
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(slot === 1 ? 'id1' : 'id2');
    router.replace(`/compare?${newParams.toString()}`, { scroll: false });
  };

  const handleAdd = () => {
    const params = new URLSearchParams(searchParams.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 py-4 md:py-8 px-4">
      
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight">Compare Names</h1>
        <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto italic">Analyze meanings, origins, and historical contexts side-by-side to find the perfect choice.</p>
      </div>

      {/* Comparison Container */}
      <div className="bg-card border border-border rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row bg-bg/50 border-b border-border p-6 md:p-10 gap-8 md:gap-12 relative">
          {/* VS Divider */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center">
            <div className="w-12 h-12 bg-card border-4 border-bg rounded-full flex items-center justify-center font-black text-xs text-primary shadow-xl">VS</div>
          </div>
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:hidden flex items-center justify-center w-full">
            <div className="h-px bg-border w-1/3"></div>
            <div className="px-4 font-black text-xs text-primary bg-bg/80 py-1 rounded-full border border-border">VS</div>
            <div className="h-px bg-border w-1/3"></div>
          </div>

          {/* Name 1 */}
          <div className="w-full md:w-1/2 relative">
            {name1 ? (
              <div className="text-center space-y-4 p-4">
                <button onClick={() => removeName(1)} className="absolute -top-2 -right-2 md:-top-4 md:-right-4 p-2 bg-danger/10 text-danger rounded-full hover:bg-danger hover:text-bg transition-all shadow-lg min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <X size={18} />
                </button>
                <div className="font-arabic text-5xl md:text-6xl text-primary drop-shadow-lg">{name1.nameArabic}</div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tight uppercase">{name1.nameEnglish}</div>
                <div className="text-[10px] font-bold text-text-muted bg-bg px-3 py-1 rounded-full inline-block uppercase tracking-widest border border-border/50">
                  {name1.gender} Name
                </div>
              </div>
            ) : <EmptySlot slot={1} onAdd={handleAdd} />}
          </div>

          {/* Name 2 */}
          <div className="w-full md:w-1/2 relative pt-8 md:pt-0">
            {name2 ? (
              <div className="text-center space-y-4 p-4">
                <button onClick={() => removeName(2)} className="absolute -top-2 -right-2 md:-top-4 md:-right-4 p-2 bg-danger/10 text-danger rounded-full hover:bg-danger hover:text-bg transition-all shadow-lg min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <X size={18} />
                </button>
                <div className="font-arabic text-5xl md:text-6xl text-primary drop-shadow-lg">{name2.nameArabic}</div>
                <div className="text-2xl md:text-3xl font-black text-text tracking-tight uppercase">{name2.nameEnglish}</div>
                <div className="text-[10px] font-bold text-text-muted bg-bg px-3 py-1 rounded-full inline-block uppercase tracking-widest border border-border/50">
                  {name2.gender} Name
                </div>
              </div>
            ) : <EmptySlot slot={2} onAdd={handleAdd} />}
          </div>
        </div>

        {/* Comparison Body */}
        <div className="p-6 md:p-10 lg:p-12">
          <ComparisonRow label="Meaning" val1={name1?.meaning} val2={name2?.meaning} />
          <ComparisonRow label="Origin" val1={name1?.origin} val2={name2?.origin} />
          <ComparisonRow label="Pronunciation" val1={name1?.pronunciation} val2={name2?.pronunciation} />
          <ComparisonRow label="Quranic" 
            val1={name1?.isQuranic ? '✦ Yes, Quranic' : 'Standard Name'} 
            val2={name2?.isQuranic ? '✦ Yes, Quranic' : 'Standard Name'} 
          />
          <ComparisonRow label="Arabic Root" 
            val1={name1?.arabicRoot} 
            val2={name2?.arabicRoot} 
            isArabic 
          />
          
          <div className="py-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 md:hidden text-center">Historical Context</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
              <div className="hidden md:block text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">History</div>
              <div className="p-5 bg-bg/30 rounded-2xl text-xs md:text-sm leading-relaxed text-text-muted italic border border-border/20">
                <span className="md:hidden text-[9px] font-black text-primary uppercase block mb-3">Name 1 History</span>
                {name1?.history || 'No historical data available for Name 1.'}
              </div>
              <div className="p-5 bg-bg/30 rounded-2xl text-xs md:text-sm leading-relaxed text-text-muted italic border border-border/20">
                <span className="md:hidden text-[9px] font-black text-primary uppercase block mb-3">Name 2 History</span>
                {name2?.history || 'No historical data available for Name 2.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
         <button 
           onClick={() => navigate('/search')} 
           className="flex items-center justify-center gap-2 bg-primary hover:bg-opacity-90 text-bg px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 min-h-[48px]"
         >
            <Search size={18} /> Find More Names
         </button>
         <button 
           onClick={() => window.print()} 
           className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary text-text px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all min-h-[48px]"
         >
            <Printer size={18} /> Print Comparison
         </button>
      </div>
    </div>
  );
};

const Compare = () => (
  <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
    <CompareContent />
  </Suspense>
);

export default Compare;
