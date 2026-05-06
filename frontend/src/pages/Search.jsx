import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import NameCard from '../components/NameCard';
import { Search as SearchIcon, Book } from 'lucide-react';

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialLetter = searchParams.get('letter') || '';
  const initialQuranic = searchParams.get('quranic') === 'true';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);
  const [genderFilter, setGenderFilter] = useState('');
  const [letterFilter, setLetterFilter] = useState(initialLetter);
  const [quranicFilter, setQuranicFilter] = useState(initialQuranic);

  // Debounce search and sync URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      
      // Update URL parameters using current React state
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
  }, [searchTerm, letterFilter, quranicFilter, setSearchParams]);

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
    }
  });

  if (error) {
    return (
      <div className="text-center py-20 bg-danger/5 border border-danger/20 rounded-2xl">
        <p className="text-danger font-bold">Failed to load names</p>
        <p className="text-sm text-text-muted mt-2">{error.message}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-danger text-bg px-6 py-2 rounded-lg font-bold text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search names, meanings..." 
              className="w-full bg-bg border border-border focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg py-3 pl-12 pr-4 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && letterFilter) setLetterFilter(''); // Clear letter if typing
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['boy', 'girl', 'unisex'].map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(genderFilter === g ? '' : g)}
                className={`px-4 py-3 rounded-lg capitalize text-sm font-medium border transition-colors ${
                  genderFilter === g 
                    ? 'bg-primary border-primary text-bg' 
                    : 'bg-bg border-border text-text-muted hover:border-primary/50'
                }`}
              >
                {g}
              </button>
            ))}
            
            <button
                onClick={() => setQuranicFilter(!quranicFilter)}
                className={`px-4 py-3 flex items-center gap-2 rounded-lg text-sm font-medium border transition-colors ${
                  quranicFilter 
                    ? 'bg-primary border-primary text-bg' 
                    : 'bg-bg border-border text-text-muted hover:border-primary/50'
                }`}
              >
                <Book size={16} /> Quranic Only
            </button>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div>
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-semibold">Filter by Alphabet</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setLetterFilter('');
                setSearchTerm('');
                setGenderFilter('');
                setQuranicFilter(false);
              }}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                !letterFilter && !searchTerm && !genderFilter && !quranicFilter ? 'bg-primary text-bg' : 'bg-bg border border-border text-text-muted hover:border-primary/50'
              }`}
            >
              All
            </button>
            {alphabets.map(letter => (
              <button
                key={letter}
                onClick={() => {
                  setLetterFilter(letter === letterFilter ? '' : letter);
                  setSearchTerm(''); // Clear search box if clicking letter
                }}
                className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                  letterFilter === letter ? 'bg-primary text-bg' : 'bg-bg border border-border text-text-muted hover:border-primary/50'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
          <span>{data?.count || 0} Results Found</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No names found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map(name => (
              <NameCard key={name._id} name={name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;