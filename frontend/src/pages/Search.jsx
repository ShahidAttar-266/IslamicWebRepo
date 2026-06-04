import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import NameCard from '../components/NameCard';
import { 
  Search as SearchIcon, 
  Book, 
  X 
} from 'lucide-react';

import { Helmet } from 'react-helmet-async';

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const initialQuery = searchParams.get('q') || '';
  const initialLetter = searchParams.get('letter') || '';
  const initialQuranic = searchParams.get('quranic') === 'true';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);
  const [genderFilter, setGenderFilter] = useState('');
  const [letterFilter, setLetterFilter] = useState(initialLetter);
  const [quranicFilter, setQuranicFilter] = useState(initialQuranic);

  const hasActiveFilters = searchTerm || genderFilter || letterFilter || quranicFilter;

  const getPageTitle = () => {
    if (debouncedTerm) return `Search Results for "${debouncedTerm}" | IslamicNames`;
    if (letterFilter) return `Names Starting with "${letterFilter}" | IslamicNames`;
    if (quranicFilter) return `Quranic Names | IslamicNames`;
    if (genderFilter) return `${genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)} Names | IslamicNames`;
    return 'Browse Islamic Names | IslamicNames';
  };

  const getPageDescription = () => {
    if (debouncedTerm) return `Explore search results for "${debouncedTerm}" on IslamicNames. Find meanings and origins of Islamic names.`;
    if (letterFilter) return `Browse Islamic names starting with the letter ${letterFilter}. Explore meanings, origins, and Quranic references.`;
    return 'Browse thousands of meaningful Islamic names. Filter by gender, alphabet, or Quranic references.';
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setGenderFilter('');
    setLetterFilter('');
    setQuranicFilter(false);
  };

  // Debounce search and sync URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      
      const params = new URLSearchParams(searchParams.toString());
      let changed = false;

      const syncParam = (key, value) => {
        if (value) {
          if (params.get(key) !== String(value)) {
            params.set(key, value);
            changed = true;
          }
        } else if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      };

      syncParam('q', searchTerm);
      syncParam('letter', letterFilter);
      if (quranicFilter) syncParam('quranic', 'true');
      else syncParam('quranic', '');

      if (changed) {
        setSearchParams(params, { replace: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, letterFilter, quranicFilter, setSearchParams, searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['names', debouncedTerm, genderFilter, letterFilter, quranicFilter],
    queryFn: async () => {
      let url = `/names?limit=200&sort=-createdAt`;
      if (debouncedTerm) url += `&q=${encodeURIComponent(debouncedTerm)}`;
      if (genderFilter) url += `&gender=${genderFilter}`;
      if (letterFilter) url += `&letter=${letterFilter}`;
      if (quranicFilter) url += `&quranic=true`;
      
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 3 * 60 * 1000, // 3 min
  });

  if (error) {
    return (
      <div className="text-center py-20 bg-danger/5 border border-danger/20 rounded-2xl px-4">
        <p className="text-danger font-bold">Failed to load names</p>
        <p className="text-sm text-text-muted mt-2">{error.message}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-danger text-bg px-6 py-2 rounded-lg font-bold text-sm min-h-[44px]">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="islamic names, islamic names for boys, islamic names for girls, muslim baby names, arabic names with meaning, quranic names, islamic names search, muslim names list, arabic muslim names, islamic names for newborn" />
        <link rel="canonical" href="https://www.islamicnames.in/search" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:url" content="https://www.islamicnames.in/search" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
      </Helmet>

      {/* Search Header */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search names, meanings..." 
              aria-label="Search Islamic names by name or meaning"
              className="w-full bg-bg border border-border focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && letterFilter) setLetterFilter(''); 
              }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              {['boy', 'girl', 'unisex'].map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(genderFilter === g ? '' : g)}
                  className={`px-4 py-3 rounded-xl capitalize text-sm font-bold border transition-colors min-h-[44px] text-center ${
                    genderFilter === g 
                      ? 'bg-primary border-primary text-bg' 
                      : 'bg-bg border-border text-text-muted hover:border-primary/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setQuranicFilter(!quranicFilter)}
                className={`flex-1 sm:flex-none px-4 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold border transition-colors min-h-[44px] ${
                  quranicFilter 
                    ? 'bg-primary border-primary text-bg' 
                    : 'bg-bg border-border text-text-muted hover:border-primary/50'
                }`}
              >
                <Book size={16} />
                <span>Quranic<span className="hidden sm:inline"> Only</span></span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-danger hover:bg-danger/5 rounded-xl transition-colors min-h-[44px]"
                >
                  <X size={16} /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-text-muted mb-4 uppercase tracking-wider font-bold">Filter by Alphabet</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 md:pb-0 md:flex-wrap custom-scrollbar scroll-smooth">
            <button
              onClick={() => setLetterFilter('')}
              aria-label="Show all names"
              className={`min-w-[42px] min-h-[42px] shrink-0 flex items-center justify-center rounded-lg text-sm font-black transition-all border ${
                !letterFilter ? 'bg-primary border-primary text-bg' : 'bg-bg border-border text-text-muted hover:border-primary/50'
              }`}
            >
              ALL
            </button>
            {alphabets.map(letter => (
              <button
                key={letter}
                aria-label={`Filter names by letter ${letter}`}
                onClick={() => {
                  setLetterFilter(letter === letterFilter ? '' : letter);
                  setSearchTerm(''); 
                }}
                className={`min-w-[42px] min-h-[42px] shrink-0 flex items-center justify-center rounded-lg text-sm font-black transition-all border ${
                  letterFilter === letter ? 'bg-primary border-primary text-bg' : 'bg-bg border-border text-text-muted hover:border-primary/50'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="content-visibility-auto min-h-[400px]">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-base md:text-xl font-bold text-text">
            {data?.count || 0} <span className="text-text-muted font-medium">Names Found</span>
          </h2>
          {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />}
        </div>

        {(isLoading && !data) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-64 animate-pulse" />
             ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl shadow-sm px-4">
            <SearchIcon size={64} className="mx-auto mb-6 text-border" />
            <p className="text-xl font-bold text-text">No names found</p>
            <p className="text-text-muted mt-2 max-w-md mx-auto">We couldn't find any names matching your current filters. Try adjusting your search or clearing all filters.</p>
            <button 
              onClick={clearAllFilters}
              className="mt-6 bg-primary text-bg px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/10"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {data?.data?.map((name, index) => (
              <NameCard 
                key={name._id} 
                name={name} 
                isLocked={!isAuthenticated && index >= 4}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;