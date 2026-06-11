import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Clock, Calendar, Eye, Sparkles } from 'lucide-react';
import { ARTICLES } from '../utils/articles-data';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter articles based on search query and category
  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separate featured article (only shown if we are on 'all' or 'girl' and no search query)
  const featuredArticle = ARTICLES.find(a => a.featured);
  const showFeatured = 
    featuredArticle && 
    !searchQuery && 
    (activeCategory === 'all' || activeCategory === 'girl');

  // Filter out the featured article from the main list if it's currently highlighted
  const displayArticles = showFeatured
    ? filteredArticles.filter(a => a.slug !== featuredArticle.slug)
    : filteredArticles;

  const categories = [
    { id: 'all', label: 'All Articles', emoji: '📚' },
    { id: 'girl', label: 'Girl Names', emoji: '👧' },
    { id: 'boy', label: 'Boy Names', emoji: '👦' },
    { id: 'quran', label: 'Quranic', emoji: '📖' },
    { id: 'tips', label: 'Naming Tips', emoji: '💡' },
  ];

  const popularArticles = ARTICLES.slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Articles & Naming Guides — IslamicNames</title>
        <meta
          name="description"
          content="Read in-depth articles and guides on Islamic baby names — meanings, origins, Quranic names, and naming tips for Muslim parents."
        />
      </Helmet>

      <div className="space-y-10">
        {/* Page Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-bg to-card border border-border rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mx-auto">
            <Sparkles size={14} className="text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">
              Knowledge & Guidance
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text max-w-3xl mx-auto leading-tight">
            Articles & Naming Guides
          </h1>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            In-depth articles on Islamic names — meanings, Sunnah recommendations, Quranic picks, and practical naming tips for parents.
          </p>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg border border-border rounded-xl text-text placeholder-text-muted/60 focus:outline-none focus:border-primary transition-colors text-sm shadow-inner"
            />
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-border pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary border-primary text-bg shadow-lg shadow-primary/20'
                  : 'bg-card border-border text-text-muted hover:border-primary/50 hover:text-text'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Articles */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured Article Card */}
            {showFeatured && (
              <Link
                to={featuredArticle.href}
                className="group block bg-card border border-border hover:border-primary rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div
                    className="h-48 md:h-full min-h-[220px] flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${featuredArticle.gradientFrom}, ${featuredArticle.gradientTo})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <span className="font-arabic text-8xl text-white/95 drop-shadow-xl select-none group-hover:scale-105 transition-transform duration-500">
                      {featuredArticle.arabicLetter}
                    </span>
                    <span className="absolute top-4 left-4 bg-accent text-bg text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                      ⭐ Featured Article
                    </span>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                    <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                      {featuredArticle.tag}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-text leading-tight group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-2 border-t border-border/40">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {featuredArticle.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {featuredArticle.readTime} read</span>
                      <span className="flex items-center gap-1"><Eye size={13} /> {featuredArticle.views} views</span>
                    </div>
                    <span className="text-xs font-bold text-accent group-hover:underline inline-flex items-center gap-1.5 pt-2">
                      Read Full Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Articles Grid */}
            {displayArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayArticles.map((article) => {
                  const isHash = article.href === '#';
                  const CardContent = () => (
                    <>
                      {/* Thumbnail Area */}
                      <div
                        className="h-32 flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <span className="font-arabic text-5xl text-white/90 drop-shadow-lg select-none group-hover:scale-110 transition-transform duration-500">
                          {article.arabicLetter}
                        </span>
                      </div>
                      
                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1 space-y-3">
                        <span
                          className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: article.tagBg, color: article.tagText }}
                        >
                          {article.tag}
                        </span>
                        
                        <h3 className="text-base font-bold text-text leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[10px] text-text-muted">
                          <span>{article.date} · {article.readTime} read</span>
                          {!isHash && (
                            <span className="flex items-center gap-1 font-bold text-primary uppercase tracking-wider">
                              Read <ArrowRight size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  );

                  if (isHash) {
                    return (
                      <div
                        key={article.slug}
                        className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-not-allowed opacity-85 hover:border-border/60 transition-all duration-300"
                      >
                        <CardContent />
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={article.slug}
                      to={article.href}
                      className="group bg-card border border-border hover:border-primary rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                    >
                      <CardContent />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-12 text-center text-text-muted space-y-3">
                <BookOpen size={48} className="mx-auto text-border" />
                <p className="font-bold text-base">No articles found</p>
                <p className="text-xs max-w-xs mx-auto">We couldn't find any articles matching your search criteria. Try selecting another category or resetting the search filter.</p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="space-y-6">
            
            {/* Categories Sidebar Widget */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4">
                Categories
              </h3>
              <ul className="divide-y divide-border/40">
                {categories.map((cat) => {
                  const count = cat.id === 'girl' ? 48 : cat.id === 'boy' ? 42 : cat.id === 'quran' ? 31 : cat.id === 'tips' ? 18 : cat.id === 'all' ? 150 : 0;
                  return (
                    <li key={cat.id} className="py-2.5 flex justify-between items-center text-sm">
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`hover:text-primary transition-colors font-medium flex items-center gap-2 ${
                          activeCategory === cat.id ? 'text-primary font-bold' : 'text-text-muted'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                      </button>
                      <span className="text-[10px] font-bold bg-bg border border-border text-text-muted px-2 py-0.5 rounded-full">
                        {count} {cat.id === 'all' ? 'total' : 'articles'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Popular Articles Widget */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent border-b border-border pb-3 mb-4">
                Popular Articles
              </h3>
              <ul className="space-y-3">
                {popularArticles.map((article, idx) => {
                  const isHash = article.href === '#';
                  const PopularLink = () => (
                    <span className="text-xs font-semibold text-text hover:text-primary transition-colors cursor-pointer flex items-start gap-2 py-0.5">
                      <span className="text-accent font-bold text-xs">{idx + 1}.</span>
                      <span className="flex-1 line-clamp-2 leading-relaxed">{article.title}</span>
                    </span>
                  );
                  return (
                    <li key={article.slug} className="border-b border-border/20 last:border-0 pb-3 last:pb-0">
                      {isHash ? (
                        <div className="opacity-80 cursor-not-allowed"><PopularLink /></div>
                      ) : (
                        <Link to={article.href}><PopularLink /></Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Naming Tip Box */}
            <div className="bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <h3 className="text-base font-black text-text">Naming Tip</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The Prophet ﷺ said: <em className="text-text">"The best names are Abdullah and Abdur-Rahman."</em> Names containing Abd (servant of) are highly recommended in Islam as they reflect humility and devotion to God.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
};

export default Blog;
