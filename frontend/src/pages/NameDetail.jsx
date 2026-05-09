import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Lock, Book, Info, Copy, ArrowLeft, Crown, Quote, Sparkles, ArrowLeftRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const GatedSection = ({ title, icon: Icon, isLocked, msg, children, onUnlock }) => {
  if (!isLocked) return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
      <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon size={20} /></div>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 overflow-hidden group">
      <div className="blur-[4px] select-none opacity-40">
         <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-3"><Icon size={20} /> {title}</h3>
         <p>This content is reserved for our premium members. It contains deep insights, historical context, and authentic references.</p>
         <div className="h-20 bg-bg/50 rounded-lg mt-4"></div>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-[2px]">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
          <Lock size={20} />
        </div>
        <p className="font-black text-[10px] uppercase tracking-widest text-amber-600 mb-1">Premium Feature</p>
        <p className="text-sm text-text-muted mb-4 text-center max-w-[250px]">{msg || `Upgrade to unlock ${title}`}</p>
        <button 
          onClick={onUnlock} 
          className="bg-amber-500 hover:bg-amber-600 text-bg px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow-lg shadow-amber-500/20 min-h-[44px]"
        >
          Unlock Now
        </button>
      </div>
    </div>
  );
};

const NameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Strict Login Check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view name details');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'premium';
  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');
  const isSelected = id1 === id || id2 === id;

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/users/favorites');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const isFavorited = favorites?.some(f => f._id === id);

  const { data: name, isLoading, error } = useQuery({
    queryKey: ['name', id],
    queryFn: async () => {
      const res = await api.get(`/names/${id}`);
      return res.data?.data;
    },
    enabled: !!id && isAuthenticated,
    retry: false
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return api.delete(`/users/favorites/${id}`);
      } else {
        return api.post(`/users/favorites/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Could not update favorites');
    }
  });

  const handleCompare = () => {
    if (!isPremium) {
      toast.error('Name Comparison is a Premium feature', { icon: '👑' });
      navigate('/pricing');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (isSelected) {
      if (id1 === id) params.delete('id1');
      else if (id2 === id) params.delete('id2');
    } else {
      if (!id1) params.set('id1', id);
      else if (!id2) params.set('id2', id);
      else {
        params.set('id1', id2);
        params.set('id2', id);
      }
    }
    navigate(`/compare?${params.toString()}`);
  };

  const hasPremiumAccess = user?.role === 'admin' || ['basic', 'premium'].includes(user?.subscription?.status);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-text-muted font-medium animate-pulse text-center">Loading name details...</p>
    </div>
  );
  
  if (error || !name) {
    const status = error?.response?.status;
    const isNotFound = status === 404 || !name;
    
    return (
      <div className="text-center py-10 md:py-20 px-4">
        <div className="bg-card border border-border p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-text mb-4">
            {isNotFound ? 'Name Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-sm md:text-base text-text-muted mb-8 leading-relaxed italic">
            {isNotFound 
              ? "We couldn't find the name you're looking for. It might have been removed or the link might be incorrect." 
              : error?.response?.data?.error || 'An unexpected error occurred while retrieving name details.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/search')} 
              className="bg-primary text-bg px-8 py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all w-full sm:w-auto min-h-[48px]"
            >
              Back to Search
            </button>
            {!isNotFound && (
              <button 
                onClick={() => window.location.reload()} 
                className="bg-card border border-border text-text px-8 py-3.5 rounded-xl font-bold hover:border-primary transition-all w-full sm:w-auto min-h-[48px]"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const copyArabic = () => {
    if (name?.nameArabic) {
      navigator.clipboard.writeText(name.nameArabic);
      toast.success('Arabic name copied to clipboard!', { icon: '📋' });
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavoriteMutation.mutate();
  };

  const handleUnlock = () => navigate('/pricing');

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-8 md:space-y-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm min-h-[44px]">
        <ArrowLeft size={18} /> BACK
      </button>

      {/* Hero Section */}
      <section className="relative bg-card border border-border rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.04] to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                name.gender === 'boy' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                name.gender === 'girl' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
              }`}>
                {name.gender || 'Unknown'} Name
              </span>
              {(name.isQuranic || name.quranReference?.surah) && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
                  <Sparkles size={12} /> Quranic
                </span>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text mb-6 tracking-tighter">
              {name.nameEnglish}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <button 
                onClick={copyArabic}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-bg border border-border hover:border-primary rounded-xl text-sm font-bold text-text-muted hover:text-primary transition-all min-h-[44px] w-full sm:w-auto"
              >
                <Copy size={16} /> Copy Arabic
              </button>
              <button 
                onClick={handleCompare}
                className={`flex items-center justify-center gap-2 px-5 py-3 bg-bg border rounded-xl text-sm font-bold transition-all min-h-[44px] w-full sm:w-auto ${
                  isSelected ? 'text-accent border-accent/30' : 'text-text-muted border-border hover:border-primary hover:text-primary'
                }`}
              >
                <ArrowLeftRight size={16} className={isSelected ? 'animate-pulse' : ''} /> 
                {isSelected ? 'Selected' : 'Compare'}
              </button>
              <button 
                onClick={handleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className={`flex items-center justify-center gap-2 px-5 py-3 bg-bg border rounded-xl text-sm font-bold transition-all min-h-[44px] w-full sm:w-auto ${
                  isFavorited ? 'border-danger/30 text-danger' : 'border-border text-text-muted hover:border-danger hover:text-danger'
                }`}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart size={16} className={isFavorited ? 'fill-danger' : ''} />
                )}
                {isFavorited ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center order-first md:order-last">
            <div className="font-arabic text-6xl md:text-8xl lg:text-9xl text-primary leading-none drop-shadow-2xl">
              {name.nameArabic}
            </div>
          </div>
        </div>
      </section>

      {/* Core Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Meaning (English)', value: name.meaning || 'N/A', italic: true, arabic: false },
          { label: 'Origin', value: name.origin || 'Arabic', italic: false, arabic: false },
          { label: 'Pronunciation', value: name.pronunciation || 'N/A', italic: false, arabic: false },
          { label: 'Arabic Root', value: name.arabicRoot || '-', italic: false, arabic: true },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border border-border p-4 md:p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-3">{item.label}</p>
            <p className={`text-text font-bold text-sm md:text-base leading-relaxed ${item.italic ? 'italic' : ''} ${item.arabic ? 'font-arabic text-xl' : ''}`}>
              {item.arabic ? item.value : `"${item.value}"`}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <GatedSection 
            title="Historical Background" 
            icon={Info} 
            isLocked={!hasPremiumAccess}
            msg="Unlock detailed historical etymology and cultural significance."
            onUnlock={handleUnlock}
          >
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed text-base md:text-lg whitespace-pre-line italic">
              {name.history || "No historical background currently available for this name."}
            </div>
          </GatedSection>

          {(name.isQuranic || name.quranReference?.surah) && (
            <GatedSection 
              title="Quranic Reference" 
              icon={Book} 
              isLocked={!hasPremiumAccess}
              msg="View full surah context, verse text, and translations."
              onUnlock={handleUnlock}
            >
              <div className="bg-bg/50 border border-primary/20 rounded-2xl p-5 md:p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Surah</span>
                      <span className="text-lg md:text-xl font-bold">{name.quranReference?.surah || 'Not specified'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Verse</span>
                      <span className="text-lg md:text-xl font-bold">{name.quranReference?.verse || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="bg-card border border-border/50 p-5 md:p-6 rounded-xl italic text-text-muted leading-relaxed relative">
                    <Quote className="absolute -top-3 -left-2 text-primary/10" size={32} />
                    {name.quranReference?.text || "Reference verified in the Noble Quran."}
                  </div>
                </div>
              </div>
            </GatedSection>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <GatedSection 
            title="Notable Bearers" 
            icon={Crown} 
            isLocked={!hasPremiumAccess}
            msg="Explore famous historical figures with this name."
            onUnlock={handleUnlock}
          >
            <div className="space-y-6">
              {name.famousPersonalities && name.famousPersonalities.length > 0 ? (
                name.famousPersonalities.map((p, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">{i+1}</div>
                      <h4 className="font-bold text-text group-hover/item:text-primary transition-colors text-sm md:text-base">{p.name}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-text-muted pl-9 leading-relaxed italic">{p.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted italic">No records found.</p>
              )}
            </div>
          </GatedSection>

          <GatedSection 
            title="Islamic Guidance" 
            icon={Sparkles} 
            isLocked={!hasPremiumAccess}
            msg="Access naming etiquette and guidance."
            onUnlock={handleUnlock}
          >
            <div className="bg-primary/5 border border-primary/10 p-5 rounded-xl text-sm text-text-muted leading-relaxed italic">
              {name.birthGuidance || "Naming in Islam is a sacred responsibility. This name is considered highly recommended for its noble meanings."}
            </div>
          </GatedSection>
        </div>
      </div>

      {/* Upgrade CTA */}
      {!hasPremiumAccess && (
        <section className="bg-card border border-primary/20 rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4">Unlock the Full History</h2>
            <p className="text-text-muted mb-8 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed italic">
              Get all Quranic ayah text, historical holders, and naming etiquette with a Premium subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <button 
                onClick={() => navigate('/pricing')} 
                className="bg-amber-500 hover:bg-amber-600 text-bg px-10 py-4 rounded-xl font-black text-xs md:text-sm transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest min-h-[48px] w-full sm:w-auto"
              >
                Upgrade to Premium
              </button>
              <button 
                onClick={() => navigate('/search')} 
                className="bg-bg border border-border hover:border-primary px-10 py-4 rounded-xl font-black text-xs md:text-sm transition-all uppercase tracking-widest min-h-[48px] w-full sm:w-auto"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NameDetail;