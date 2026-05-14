import { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const NameCard = lazy(() => import('../components/NameCard'));

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Fetch some featured/recent names
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: recentNames, isLoading } = useQuery({
    queryKey: ['recentNames'],
    queryFn: async () => {
      try {
        const res = await api.get('/names?sort=-createdAt&limit=8');
        return res.data?.data || [];
      } catch (err) {
        console.error('Home query error:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: isVisible, // Only fetch when visible
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('recent-names-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-12 md:space-y-20 lg:space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 md:pt-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-text leading-tight tracking-tight">
          Discover <span className="text-primary">IslamicNames</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-text-muted mb-8 md:mb-12 italic max-w-2xl mx-auto">
          "Meaningful Names. Timeless Legacy."
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card/50 sm:bg-card p-2 sm:p-1.5 rounded-2xl sm:rounded-full border border-border focus-within:border-primary transition-all shadow-xl shadow-black/20">
            <div className="relative flex-1 flex items-center min-h-[48px]">
              <SearchIcon className="absolute left-4 text-text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, meaning..." 
                className="w-full bg-transparent text-text py-2 md:py-3 pl-12 pr-4 outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="bg-primary text-bg hover:bg-opacity-90 px-8 py-3.5 sm:py-2.5 rounded-xl sm:rounded-full font-bold transition-all shadow-lg shadow-primary/20 min-h-[48px]"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Featured Names */}
      <section id="recent-names-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Recently Added</h2>
            <p className="text-text-muted text-sm md:text-base">Discover our latest curated additions to the library</p>
          </div>
          <button 
            onClick={() => navigate('/search')} 
            className="flex items-center gap-2 text-primary text-sm md:text-base font-bold transition-all group min-h-[44px]"
          >
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {(recentNames || []).map((name, index) => (
                <NameCard 
                  key={name._id} 
                  name={name} 
                  isLocked={!isAuthenticated && index >= 4}
                />
              ))}
            </div>
          </Suspense>
        )}
      </section>

      {/* CTA Banner */}
      <section className="min-h-[420px] bg-card border border-border rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6">Unlock the Full History</h2>
          <p className="text-text-muted text-sm md:text-lg mb-8 md:mb-10 leading-relaxed italic">
            Upgrade to Premium to reveal detailed historical backgrounds, precise Quranic references, famous personalities, and save unlimited favorites.
          </p>
          <button 
            onClick={() => navigate('/pricing')} 
            className="w-full sm:w-auto bg-accent text-bg px-10 py-4 rounded-xl font-black text-sm md:text-base hover:scale-105 transition-all shadow-xl shadow-accent/20 min-h-[48px]"
          >
            EXPLORE PREMIUM PLANS
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;