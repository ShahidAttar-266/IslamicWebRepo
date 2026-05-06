import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Lock, Book, Info, Copy, ArrowLeft, Crown, Quote, Sparkles, ArrowLeftRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const GatedSection = ({ title, icon: Icon, isLocked, msg, children, onUnlock }) => {
  if (!isLocked) return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon size={20} /></div>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden group">
      <div className="blur-[4px] select-none opacity-40">
         <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-3"><Icon size={20} /> {title}</h3>
         <p>This content is reserved for our premium members. It contains deep insights, historical context, and authentic references.</p>
         <div className="h-20 bg-bg/50 rounded-lg mt-4"></div>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-[2px]">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
          <Lock size={20} />
        </div>
        <p className="font-black text-xs uppercase tracking-widest text-amber-600 mb-1">Premium Feature</p>
        <p className="text-sm text-text-muted mb-4 text-center max-w-[250px]">{msg || `Upgrade to unlock ${title}`}</p>
        <button 
          onClick={onUnlock} 
          className="bg-amber-500 hover:bg-amber-600 text-bg px-5 py-2 rounded-full font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
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

  // Fetch favorites to check status
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
      console.log(`[DEBUG] Fetching name details for ID: ${id}`);
      try {
        const res = await api.get(`/names/${id}`);
        console.log('[DEBUG] API Response Success:', res.data);
        return res.data?.data;
      } catch (err) {
        console.error('[DEBUG] API Fetch Error:', err.response?.data || err.message);
        throw err;
      }
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
        // Shift slots
        params.set('id1', id2);
        params.set('id2', id);
      }
    }
    navigate(`/compare?${params.toString()}`);
  };

  const hasPremiumAccess = user?.role === 'admin' || ['basic', 'premium'].includes(user?.subscription?.status);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-text-muted font-medium animate-pulse">Loading name details...</p>
    </div>
  );
  
  if (error || !name) {
    const status = error?.response?.status;
    const isNotFound = status === 404 || !name;
    
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-card border border-border p-12 rounded-[2.5rem] max-w-xl mx-auto shadow-2xl shadow-primary/5">
          <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={40} />
          </div>
          <h1 className="text-3xl font-black text-text mb-4">
            {isNotFound ? 'Name Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            {isNotFound 
              ? "We couldn't find the name you're looking for. It might have been removed or the link might be incorrect." 
              : error?.response?.data?.error || 'An unexpected error occurred while retrieving name details.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/search')} 
              className="bg-primary text-bg px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
            >
              Back to Search
            </button>
            {!isNotFound && (
              <button 
                onClick={() => window.location.reload()} 
                className="bg-card border border-border text-text px-8 py-3 rounded-xl font-bold hover:border-primary transition-all"
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
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const handleUnlock = () => navigate('/pricing');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium">
        <ArrowLeft size={18} /> Back
      </button>

      {/* Hero Section */}
      <section className="relative bg-card border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                name.gender === 'boy' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                name.gender === 'girl' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
              }`}>
                {name.gender || 'Unknown'} Name
              </span>
              {(name.isQuranic || name.quranReference?.surah) && (
                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
                  <Sparkles size={12} /> Quranic
                </span>
              )}
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-text mb-4 tracking-tight group">
              {name.nameEnglish}
            </h1>
            
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <button 
                onClick={copyArabic}
                className="flex items-center gap-2 px-4 py-2 bg-bg border border-border hover:border-primary rounded-xl text-sm font-bold text-text-muted hover:text-primary transition-all group"
              >
                <Copy size={16} className="group-hover:rotate-12 transition-transform" /> Copy Arabic
              </button>
              <button 
                onClick={handleCompare}
                className={`flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl text-sm font-bold transition-all group ${
                  isSelected ? 'text-accent border-accent/30' : 'text-text-muted hover:text-primary hover:border-primary'
                }`}
              >
                <ArrowLeftRight size={16} className={isSelected ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} /> 
                {isSelected ? 'Selected for Compare' : 'Compare Name'}
              </button>
              <button 
                onClick={handleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 bg-bg border rounded-xl text-sm font-bold transition-all group ${
                  isFavorited ? 'border-danger/30 text-danger' : 'border-border text-text-muted hover:border-danger hover:text-danger'
                }`}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart size={16} className={isFavorited ? 'fill-danger' : 'group-hover:scale-125 transition-transform'} />
                )}
                {isFavorited ? 'Saved' : 'Save to Favorites'}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="font-arabic text-8xl md:text-9xl text-primary leading-none drop-shadow-[0_10px_30px_rgba(45,184,122,0.3)]">
              {name.nameArabic}
            </div>
          </div>
        </div>
      </section>

      {/* Core Info Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Meaning (English)</p>
          <p className="text-text font-bold leading-relaxed italic">"{name.meaning || 'Meaning pending verification.'}"</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Origin</p>
          <p className="text-text font-bold text-lg">{name.origin || 'Arabic'}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Pronunciation</p>
          <p className="text-text font-bold text-lg">{name.pronunciation || 'N/A'}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Arabic Root</p>
          <p className="text-text font-bold text-lg font-arabic">{name.arabicRoot || '-'}</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Historical Background */}
          <GatedSection 
            title="Historical Background" 
            icon={Info} 
            isLocked={!hasPremiumAccess}
            msg="Unlock detailed historical etymology and cultural significance."
            onUnlock={handleUnlock}
          >
            <div className="prose prose-invert max-w-none text-text-muted leading-loose text-lg whitespace-pre-line">
              {name.history || "No historical background currently available for this name."}
            </div>
          </GatedSection>

          {/* Quranic References */}
          {(name.isQuranic || name.quranReference?.surah) && (
            <GatedSection 
              title="Quranic Reference" 
              icon={Book} 
              isLocked={!hasPremiumAccess}
              msg="View full surah context, verse text, and translations."
              onUnlock={handleUnlock}
            >
              <div className="bg-bg/50 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Book size={80} className="text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-primary block mb-1">Surah</span>
                      <span className="text-xl font-bold">{name.quranReference?.surah || 'Not specified'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black uppercase tracking-widest text-primary block mb-1">Verse</span>
                      <span className="text-xl font-bold">{name.quranReference?.verse || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="bg-card border border-border/50 p-6 rounded-xl italic text-text-muted leading-relaxed relative">
                    <Quote className="absolute -top-3 -left-2 text-primary/20" size={32} />
                    {name.quranReference?.text || "Reference verified in the Noble Quran."}
                  </div>
                </div>
              </div>
            </GatedSection>
          )}
        </div>

        <div className="space-y-8">
          {/* Famous Personalities */}
          <GatedSection 
            title="Notable Bearers" 
            icon={Crown} 
            isLocked={!hasPremiumAccess}
            msg="Explore the lives of famous historical figures with this name."
            onUnlock={handleUnlock}
          >
            <div className="space-y-6">
              {name.famousPersonalities && name.famousPersonalities.length > 0 ? (
                name.famousPersonalities.map((p, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">{i+1}</div>
                      <h4 className="font-bold text-text group-hover/item:text-primary transition-colors">{p.name}</h4>
                    </div>
                    <p className="text-sm text-text-muted pl-9 leading-relaxed">{p.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted italic">No records found.</p>
              )}
            </div>
          </GatedSection>

          {/* Birth Guidance */}
          <GatedSection 
            title="Islamic Guidance" 
            icon={Sparkles} 
            isLocked={!hasPremiumAccess}
            msg="Access birth month recommendations and naming etiquette."
            onUnlock={handleUnlock}
          >
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-sm text-text-muted leading-relaxed italic">
              {name.birthGuidance || "Naming in Islam is a sacred responsibility. This name is considered highly recommended for its noble meanings."}
            </div>
          </GatedSection>
        </div>
      </div>

      {/* Upgrade CTA for non-pro */}
      {!hasPremiumAccess && (
        <section className="bg-gradient-to-br from-card to-bg border border-primary/20 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Unlock the Full Story of {name.nameEnglish}</h2>
            <p className="text-text-muted mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Get all Quranic ayah text, every historical holder, Hijri birth dates, and more with a Premium subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/pricing')} 
                className="bg-amber-500 hover:bg-amber-600 text-bg px-10 py-4 rounded-full font-black text-sm transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest"
              >
                Upgrade to Premium
              </button>
              <button 
                onClick={() => navigate('/search')} 
                className="bg-card border border-border hover:border-primary px-10 py-4 rounded-full font-black text-sm transition-all uppercase tracking-widest"
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