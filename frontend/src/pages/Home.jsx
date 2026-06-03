import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Book, Star, Sparkles, Heart } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import NameCard from '../components/NameCard';

import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

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
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const NamesSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-[260px] animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-12 md:space-y-20 lg:space-y-24">
      <Helmet>
        <title>Islamic Names | Meaningful Names for Boys & Girls | IslamicNames</title>
        <meta name="description" content="Discover thousands of meaningful Islamic names for boys and girls with authentic Quranic references and historical background. Explore Islamic names with meanings." />
        <meta name="keywords" content="islamicnames, islamic names, islamic names for boys, islamic names for girls, quran islamic names for girls, islamic names for men, islamic names for boys from quran, islamic names of prophets, islamic names Arabic, islamic names with meanings, islamic names for women" />
        <link rel="canonical" href="https://www.islamicnames.in/" />
        
        <meta property="og:title" content="Islamic Names | Meaningful Names for Boys & Girls" />
        <meta property="og:description" content="Find the perfect Islamic name with deep meanings and Quranic roots. Authentic and verified." />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 md:pt-10 px-4 min-h-[300px] flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-text leading-tight tracking-tight">
          Discover <span className="text-primary">Islamic Names</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-text-muted mb-8 md:mb-12 italic max-w-2xl mx-auto">
          "Meaningful Names. Timeless Legacy."
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card/50 sm:bg-card p-2 sm:p-1.5 rounded-2xl sm:rounded-full border border-border focus-within:border-primary transition-all shadow-xl shadow-black/20">
          <div className="relative flex-1 min-h-[48px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, meaning..." 
              aria-label="Search Islamic names by name or meaning"
              className="w-full bg-transparent text-text py-3 md:py-3.5 pl-12 pr-4 outline-none text-base"
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

        {(isLoading || !recentNames) ? (
          <NamesSkeleton />
        ) : (
          <Suspense fallback={<NamesSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-h-[260px]">
              {recentNames.map((name, index) => (
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

      {/* SEO Content Section (Approx 600 words) */}
      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-border/50">
        <div className="prose prose-invert max-w-none space-y-12">
          <div className="text-center space-y-4 mb-16">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text leading-tight">
               The Ultimate Resource for <span className="text-primary">Islamic Names</span> with Meanings
             </h2>
             <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-10">
            <div className="space-y-4">
              <p className="text-lg text-text-muted leading-relaxed italic">
                Choosing the perfect name for your child is one of the most important responsibilities for Muslim parents. In Islam, a name is not just a label but a prayer and a lifelong identity that carries spiritual and social significance. Our comprehensive tool, <span className="text-text font-bold">IslamicNames</span>, is designed to help you navigate the vast and beautiful world of <span className="text-text font-bold">Islamic names</span>. Whether you are looking for <span className="text-text font-bold">Islamic names for boys</span>, <span className="text-text font-bold">Islamic names for girls</span>, or even <span className="text-text font-bold">islamic names for men</span> and <span className="text-text font-bold">women</span>, our database provides verified information rooted in tradition and scholarship. We focus on providing <span className="text-text font-bold">islamic names with meanings</span> to ensure every choice is intentional and beautiful.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-[2rem] border border-border shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Star size={24} /></div>
                  <h3 className="text-xl font-bold text-text m-0">Islamic Names for Boys: Strength and Faith</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  When searching for <span className="text-text font-bold">islamic names for boys</span>, many parents look for attributes of strength, leadership, and devotion. Our collection includes classic <span className="text-text font-bold">islamic names of prophets</span> such as Muhammad, Ibrahim, and Musa, which remain evergreen choices for Muslim families worldwide. Additionally, we offer a curated list of <span className="text-text font-bold">islamic names for boys from quran</span>, highlighting those mentioned in the holy book with their direct contextual meanings. From names like Zayd and Yahya to modern yet traditional variations, <span className="text-text font-bold">islamicnames</span> provides a bridge between ancient wisdom and contemporary naming trends. Choosing a name like 'Abdullah' or 'Hamza' ensures that your son carries a legacy of faith and character throughout his life.
                </p>
              </div>

              <div className="bg-card p-8 rounded-[2rem] border border-border shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl"><Sparkles size={24} /></div>
                  <h3 className="text-xl font-bold text-text m-0">Islamic Names for Girls: Elegance and Quranic Roots</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  For parents seeking <span className="text-text font-bold">islamic names for girls</span>, the emphasis often lies on beauty, grace, and spiritual depth. Our tool features an extensive range of <span className="text-text font-bold">quran islamic names for girls</span>, drawing directly from the verses of the Quran to provide names like Maryam, Sarah, and Hawa. These names carry a timeless appeal and are deeply respected within the Ummah. We also specialize in <span className="text-text font-bold">islamic names for women</span> that honor the Sahabiyat (companions of the Prophet) and influential figures in Islamic history, such as Khadija and Aisha. By providing <span className="text-text font-bold">islamic names Arabic</span> script alongside their English transliteration and deep meanings, we make it easy to find a name that resonates with your heart and heritage.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-8 md:p-12 rounded-[2.5rem]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary/20 text-primary rounded-2xl"><Book size={32} /></div>
                <h3 className="text-2xl font-black text-text m-0">The Significance of Arabic Roots and Quranic Context</h3>
              </div>
              <p className="text-base text-text-muted leading-relaxed">
                The beauty of <span className="text-text font-bold">islamic names Arabic</span> lies in their linguistic precision and the layered meanings they convey. Every name in our database is analyzed for its etymological root, providing parents with a clear understanding of what a name truly represents. <span className="text-text font-bold">Islamic names with meanings</span> are vital because the Prophet (peace be upon him) encouraged parents to give their children good names. Our platform simplifies this search by allowing you to filter by 'Quranic' status, ensuring that you can easily find <span className="text-text font-bold">islamic names for boys from quran</span> or girls that have a direct divine connection. Whether it's a name signifying light (Noor), patience (Sabr), or gratitude (Shakir), our tool ensures you have all the information needed to make an informed decision for your family's future.
              </p>
            </div>

            <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl text-center">
              <div className="inline-flex p-4 bg-accent/10 text-accent rounded-full mb-6"><Heart size={32} fill="currentColor" className="animate-pulse" /></div>
              <h3 className="text-2xl font-black text-text mb-6">Why Choose IslamicNames?</h3>
              <p className="text-lg text-text-muted leading-relaxed max-w-3xl mx-auto italic">
                <span className="text-text font-bold">IslamicNames</span> is more than just a directory; it is a curated experience for the modern Muslim family. We understand that finding the right <span className="text-text font-bold">islamic names</span> involves more than just a list of words. That’s why we provide historical backgrounds, side-by-side comparisons, and even PDF exports to make your naming journey as smooth as possible. From <span className="text-text font-bold">islamic names for men</span> to <span className="text-text font-bold">islamic names for girls</span>, our commitment to authenticity and ease of use makes us the preferred choice for millions. Explore our library today and discover the perfect name that your child will carry with pride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6">Explore the Full Library</h2>
          <p className="text-text-muted text-sm md:text-lg mb-8 md:mb-10 leading-relaxed italic">
            Access thousands of meaningful names with detailed historical backgrounds, precise Quranic references, and famous personalities for free.
          </p>
          <button 
            onClick={() => navigate('/search')} 
            className="w-full sm:w-auto bg-accent text-bg px-10 py-4 rounded-xl font-black text-sm md:text-base hover:scale-105 transition-all shadow-xl shadow-accent/20 min-h-[48px]"
          >
            START BROWSING
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
