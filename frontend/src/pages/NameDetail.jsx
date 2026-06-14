import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  Book,
  Info,
  Copy,
  ArrowLeft,
  Crown,
  Quote,
  Sparkles,
  ArrowLeftRight,
  Loader2,
  LogIn
} from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

// Soft login prompt component - appears as a subtle banner for non-authenticated users
import { Helmet } from 'react-helmet-async';

const SoftLoginBanner = ({ onLogin, onDismiss }) => (
  <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <LogIn size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-sm font-bold text-text">Sign in to save names and compare</p>
        <p className="text-xs text-text-muted">Save your favorites and compare names easily</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onDismiss}
        className="px-4 py-2 text-xs font-bold text-text-muted hover:text-text transition-colors min-h-[36px]"
      >
        Maybe Later
      </button>
      <button
        onClick={onLogin}
        className="bg-primary hover:bg-primary/90 text-bg px-5 py-2 rounded-lg font-bold text-xs transition-all min-h-[36px]"
      >
        Sign In
      </button>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
      <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon size={20} /></div>
        {title}
      </h3>
      {children}
    </div>
  );
};

const NameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [showLoginBanner, setShowLoginBanner] = useState(!isAuthenticated);

  const handleLogin = () => navigate('/login');
  const handleDismissBanner = () => setShowLoginBanner(false);

  const { data: name, isLoading, error } = useQuery({
    queryKey: ['name', id],
    queryFn: async () => {
      const res = await api.get(`/names/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 min
    initialData: () => {
      if (typeof window !== 'undefined' && window.__INITIAL_DATA__?.name) {
        const preloaded = window.__INITIAL_DATA__.name;
        if (preloaded._id === id || preloaded.slug === id) {
          return preloaded;
        }
      }
      return undefined;
    },
  });

  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');
  const isSelected = id1 === (name?.slug || id) || id2 === (name?.slug || id);

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/users/favorites');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const isFavorited = favorites?.some(f => f._id === name?._id);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!name?._id) return;
      if (isFavorited) {
        return api.delete(`/users/favorites/${name._id}`);
      } else {
        return api.post(`/users/favorites/${name._id}`);
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
    const params = new URLSearchParams(window.location.search);
    const targetId = name?.slug || id;
    if (isSelected) {
      if (id1 === targetId) params.delete('id1');
      else if (id2 === targetId) params.delete('id2');
    } else {
      if (!id1) params.set('id1', targetId);
      else if (!id2) params.set('id2', targetId);
      else {
        params.set('id1', id2);
        params.set('id2', targetId);
      }
    }
    navigate(`/compare?${params.toString()}`);
  };

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-8 md:space-y-12 animate-pulse">
      <div className="h-6 w-20 bg-card rounded-md mb-8" />
      
      {/* Hero Skeleton */}
      <div className="bg-card border border-border rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 h-[300px] md:h-[400px]" />
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border h-24 md:h-32 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-card border border-border h-64 rounded-2xl" />
          <div className="bg-card border border-border h-64 rounded-2xl" />
        </div>
        <div className="bg-card border border-border h-96 rounded-2xl" />
      </div>
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
    if (!isAuthenticated) {
      toast.success('Please sign in to save names', { icon: '🔐' });
      navigate('/login');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-8 md:space-y-12">
      <Helmet>
        <title>{`${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`}</title>
        <meta name="description" content={`Find the meaning, origin, pronunciation, and Quranic reference for the name ${name.nameEnglish}. Explore deep historical background and naming etiquette.`} />
        <meta name="keywords" content={`${name.nameEnglish} meaning, ${name.nameEnglish} islamic name, ${name.nameEnglish} muslim name, ${name.nameArabic} meaning, islamic name ${name.nameEnglish}, meaning of ${name.nameEnglish}, ${name.nameEnglish} origin, muslim baby name ${name.nameEnglish}`} />
        <link rel="canonical" href={`https://www.islamicnames.in/name/${name.slug || id}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={`${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`} />
        <meta property="og:description" content={`Discover the deep meaning and historical context of the name ${name.nameEnglish}.`} />
        <meta property="og:url" content={`https://www.islamicnames.in/name/${name.slug || id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name.nameEnglish} (${name.nameArabic}) Meaning & Origin | IslamicNames`} />
        <meta name="twitter:description" content={`Discover the deep meaning and historical context of the name ${name.nameEnglish}.`} />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${name.nameEnglish} - Meaning, Origin & Islamic Significance`,
            "description": `Detailed information about the Islamic name ${name.nameEnglish}, including its meaning: "${name.meaning}", origin: ${name.origin || 'Arabic'}, and historical context.`,
            "datePublished": name.createdAt || new Date().toISOString(),
            "author": { "@type": "Organization", "name": "IslamicNames" },
            "publisher": {
              "@type": "Organization",
              "name": "IslamicNames",
              "logo": { "@type": "ImageObject", "url": "https://www.islamicnames.in/logo-120.webp" }
            },
            "mainEntity": {
              "@type": "DefinedTerm",
              "name": name.nameEnglish,
              "alternateName": name.nameArabic,
              "description": name.meaning,
              "inDefinedTermSet": "https://www.islamicnames.in"
            }
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islamicnames.in/" },
              { "@type": "ListItem", "position": 2, "name": "Browse Names", "item": "https://www.islamicnames.in/search" },
              { "@type": "ListItem", "position": 3, "name": name.nameEnglish, "item": `https://www.islamicnames.in/name/${name.slug || id}` }
            ]
          })}
        </script>
      </Helmet>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm min-h-[44px]">
        <ArrowLeft size={18} /> BACK
      </button>

      {/* Soft Login Banner - Only show to non-authenticated users */}
      {!isAuthenticated && showLoginBanner && (
        <div className="min-h-[80px]">
          <SoftLoginBanner onLogin={handleLogin} onDismiss={handleDismissBanner} />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-card border border-border rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.04] to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                name.gender === 'boy' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                name.gender === 'girl' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
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

          <div className="flex flex-col items-center justify-center order-first md:order-last min-h-[120px] md:min-h-[160px]">
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
          <Section 
            title="Historical Background" 
            icon={Info} 
          >
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed text-base md:text-lg whitespace-pre-line italic">
              {name.history || "No historical background currently available for this name."}
            </div>
          </Section>

          {(name.isQuranic || name.quranReference?.surah) && (
            <Section 
              title="Quranic Reference" 
              icon={Book} 
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
            </Section>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <Section 
            title="Notable Bearers" 
            icon={Crown} 
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
          </Section>

          <Section 
            title="Islamic Guidance" 
            icon={Sparkles} 
          >
            <div className="bg-primary/5 border border-primary/10 p-5 rounded-xl text-sm text-text-muted leading-relaxed italic">
              {name.birthGuidance || "Naming in Islam is a sacred responsibility. This name is considered highly recommended for its noble meanings."}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default NameDetail;