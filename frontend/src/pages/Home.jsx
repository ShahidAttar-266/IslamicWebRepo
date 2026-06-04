import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import NameCard from '../components/NameCard';
import HomeFAQ from '../components/HomeFAQ';

import { Helmet } from 'react-helmet-async';

const NamesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-[260px] animate-pulse" />
    ))}
  </div>
);

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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



  return (
    <div className="space-y-12 md:space-y-20 lg:space-y-24">
      <Helmet>
        <title>Islamic Names - Discover Meaningful Muslim Names for Boys & Girls</title>
        <meta name="description" content="Explore thousands of Islamic names for boys and girls with authentic meanings. Find Quranic names, names of prophets, and unique Arabic Muslim baby names with rich historical backgrounds." />
        <meta name="keywords" content="islamicnames, islamic names, islamic names for boys, islamic names for girls, quran islamic names for girls, islamic names for men, islamic names for boys from quran, islamic names of prophets, islamic names Arabic, islamic names with meanings, islamic names for women" />
        <link rel="canonical" href="https://www.islamicnames.in/" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Islamic Names - Discover Meaningful Muslim Names for Boys & Girls" />
        <meta property="og:description" content="Explore thousands of Islamic names for boys and girls with authentic meanings. Find Quranic names, names of prophets, and unique Arabic Muslim baby names with rich historical backgrounds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.islamicnames.in/" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        <meta property="og:site_name" content="IslamicNames" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Islamic Names - Discover Meaningful Muslim Names for Boys & Girls" />
        <meta name="twitter:description" content="Explore thousands of Islamic names for boys and girls with authentic meanings. Find Quranic names, names of prophets, and unique Arabic Muslim baby names with rich historical backgrounds." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 md:pt-10 px-4 min-h-[300px] flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-text leading-tight tracking-tight">
          Discover <span className="text-primary">IslamicNames</span>
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
              {recentNames.map((name) => (
                <NameCard 
                  key={name._id} 
                  name={name} 
                />
              ))}
            </div>
          </Suspense>
        )}
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-text-muted leading-relaxed space-y-6 text-sm md:text-base text-justify">
        <h2 className="text-2xl md:text-3xl font-black text-text mb-6">Welcome to IslamicNames: The Ultimate Resource for Meaningful Muslim Baby Names</h2>
        
        <p>Choosing the perfect name for your child is one of the most important and joyous responsibilities in Islam. A name is not just a simple identifier; it is a profound prayer, an aspiration, and an integral part of a person's lifelong identity. According to Islamic tradition, a good name brings blessings and shapes character. At <strong>IslamicNames</strong>, our mission is to assist you in discovering the most beautiful, authentic, and deeply meaningful <strong>islamic names</strong>. Whether you are looking for timeless classical names or unique modern choices, our comprehensive database covers a vast array of options tailored for every family across the globe.</p>

        <h3 className="text-xl md:text-2xl font-bold text-text mt-8 mb-4">Discover Beautiful Islamic Names for Boys and Girls</h3>
        <p>Our platform is meticulously curated to offer an extensive and diverse collection of <strong>islamic names for boys</strong> and <strong>islamic names for girls</strong>. For parents seeking strong, noble qualities, our selection of <strong>islamic names for men</strong> includes powerful historical figures, brave warriors, and righteous scholars who have shaped Islamic history. For your daughters, you will find an exquisite array of elegant, graceful, and historically significant <strong>islamic names for women</strong> that beautifully reflect purity, faith, modesty, and virtue. Each name is thoroughly researched to ensure its root meaning perfectly aligns with the beautiful teachings and values of Islam.</p>
        
        <h3 className="text-xl md:text-2xl font-bold text-text mt-8 mb-4">The Blessing of Quranic Islamic Names</h3>
        <p>There is a unique, unparalleled blessing in selecting a name directly from the Holy Quran. We have carefully compiled dedicated lists of <strong>quran islamic names for girls</strong> and <strong>islamic names for boys from quran</strong>. Naming your precious child after beautiful words, divine signs, or the righteous individuals explicitly mentioned by Allah (SWT) provides a continuous, lifelong spiritual connection. Names such as Maryam, Sarah, Yahya, and Musa not only carry incredible historical weight but also bring a profound sense of divine peace, resilience, and legacy to your child's life. We provide the exact Ayah (verse) reference so you can read and verify the divine context yourself.</p>

        <h3 className="text-xl md:text-2xl font-bold text-text mt-8 mb-4">Honoring the Prophets and Preserving Arabic Heritage</h3>
        <p>Many devoted families deeply desire to honor the rich spiritual history of Islam by choosing <strong>islamic names of prophets</strong>. Bestowing a noble prophetic name like Muhammad, Ibrahim, Isa, Nuh, or Yusuf upon your son is a beautiful way to constantly inspire him with the exemplary character, immense patience, and unwavering faith of these great messengers. Furthermore, if you are looking for authentic linguistic roots, our comprehensive catalog of <strong>islamic names Arabic</strong> origin will connect your child to the beautiful language of the Quran. We provide clear Arabic calligraphy and phonetic spelling, ensuring exact pronunciation and precise translation.</p>

        <h3 className="text-xl md:text-2xl font-bold text-text mt-8 mb-4">Authentic Islamic Names With Meanings</h3>
        <p>We deeply understand that an authentic and positive meaning is the very core of any good name. That's why we focus heavily on providing verified <strong>islamic names with meanings</strong>. The Prophet Muhammad (PBUH) instructed us to give our children good, wholesome names, reminding us that people will be called by their names and their fathers' names on the Day of Resurrection. Every single entry in our <strong>islamicnames</strong> database is rigorously cross-referenced with classical Arabic lexicons and reputable scholarly sources. This guarantees that whether you are searching for a name that means "divine light," "unyielding bravery," "infinite mercy," or "profound wisdom," the definition you read is entirely accurate, culturally respectful, and Islamically permissible.</p>

        <h3 className="text-xl md:text-2xl font-bold text-text mt-8 mb-4">Why Choose IslamicNames?</h3>
        <p>Our ultimate goal is to make your naming journey as joyful, seamless, and informed as possible. By providing accurate phonetic pronunciations, stunning Arabic script, detailed historical background, and scholar-verified meanings, we completely remove the guesswork from finding the perfect name. We believe that every child deserves a beautiful legacy, and that legacy begins the moment they are named. Explore our rich, user-friendly library today to find the perfect name that honors your deeply held faith, reflects your highest hopes, and brings lasting, abundant blessings to your family for generations to come.</p>
      </section>

      {/* SEO FAQ Section */}
      <HomeFAQ />
    </div>
  );
};

export default Home;