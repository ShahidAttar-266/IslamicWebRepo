import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import NameCard from '../components/NameCard';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch some featured/recent names
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
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
          Discover <span className="text-primary">NoorNames</span>
        </h1>
        <p className="text-lg text-text-muted mb-10 italic">
          Meaningful Names. Timeless Legacy.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, meaning, or origin..." 
              className="w-full bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-full py-4 pl-12 pr-6 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 bg-primary text-bg hover:bg-opacity-90 px-6 py-2 rounded-full font-semibold transition-all">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Featured Names */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Recently Added Names</h2>
            <p className="text-text-muted">Discover our latest curated additions</p>
          </div>
          <button onClick={() => navigate('/search')} className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View All <ArrowRight size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(recentNames || []).map(name => (
              <NameCard key={name._id} name={name} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        
        <h2 className="text-3xl font-bold mb-4 relative z-10">Unlock the Full History</h2>
        <p className="text-text-muted mb-8 max-w-2xl mx-auto relative z-10">
          Upgrade to Premium to reveal detailed historical backgrounds, precise Quranic references, famous personalities, and save unlimited favorites.
        </p>
        <button onClick={() => navigate('/pricing')} className="relative z-10 bg-accent text-bg px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-accent/20">
          View Premium Plans
        </button>
      </section>
    </div>
  );
};

export default Home;