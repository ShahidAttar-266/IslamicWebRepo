import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Book, Crown, ArrowRight, ArrowLeftRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const NameCard = ({ name, onFavorite, delay = 0 }) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'premium';
  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');
  const isSelected = id1 === name._id || id2 === name._id;

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isPremium) {
      toast.error('Name Comparison is a Premium feature', { icon: '👑' });
      navigate('/pricing');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (isSelected) {
      if (id1 === name._id) params.delete('id1');
      else if (id2 === name._id) params.delete('id2');
    } else {
      if (!id1) params.set('id1', name._id);
      else if (!id2) params.set('id2', name._id);
      else {
        // If both full, replace the first one with the second, and the second with the new one
        params.set('id1', id2);
        params.set('id2', name._id);
      }
    }
    
    // Check if we are already on the compare page
    const basePath = window.location.pathname.includes('/compare') ? '/compare' : '/compare';
    navigate(`${basePath}?${params.toString()}`);
  };

  const isBoy = name.gender === 'boy';
  const isGirl = name.gender === 'girl';
  
  const genderStyles = isBoy 
    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
    : isGirl 
    ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' 
    : 'bg-purple-500/10 text-purple-500 border-purple-500/20';

  const favoriteMutation = useMutation({
    mutationFn: (id) => api.post(`/users/favorites/${id}`),
    onSuccess: () => toast.success('Added to favorites!'),
    onError: () => toast.error('Could not save favorite')
  });

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(name._id);
    } else {
      if (!isAuthenticated) {
        toast.error('Please login to save favorites');
        navigate('/login');
        return;
      }
      favoriteMutation.mutate(name._id);
    }
  };

  return (
    <Link 
      to={`/name/${name._id}`} 
      className="group relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
      style={{ animationDelay: `${delay}s` }}
      aria-label={`${name.nameEnglish} — ${name.gender} name`}
    >
      {/* Decorative Arabic Background Letter */}
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
        <span className="text-8xl font-arabic select-none pointer-events-none">
          {name.nameArabic.charAt(0)}
        </span>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header: Arabic Name & Favorite Action */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-4xl font-arabic text-primary leading-none group-hover:scale-110 transition-transform duration-500 origin-left">
            {name.nameArabic}
          </div>
          <button 
            onClick={handleFavoriteClick}
            className="p-2 rounded-full bg-bg/50 border border-border text-text-muted hover:text-danger hover:border-danger/30 transition-all duration-300"
          >
            <Heart size={18} fill={favoriteMutation.isSuccess ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Middle: English Name & Main Badge */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors duration-300">
              {name.nameEnglish}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${genderStyles}`}>
              {name.gender}
            </span>
          </div>
          
          {/* Secondary Badges */}
          <div className="flex flex-wrap gap-2">
            {(name.isQuranic || name.quranReference?.surah) && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                <Book size={10} /> Quranic
              </span>
            )}
            {name.isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                <Crown size={10} /> Premium
              </span>
            )}
          </div>
        </div>

        {/* Meaning Section */}
        <div className="relative">
          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed italic pr-4">
            "{name.meaning}"
          </p>
        </div>
        
        {/* Footer: Detailed Action */}
        <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center group-hover:border-primary/20 transition-colors">
          <button 
            onClick={handleCompare}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              isSelected ? 'text-accent' : 'text-text-muted hover:text-primary'
            }`}
          >
            <ArrowLeftRight size={14} className={isSelected ? 'animate-pulse' : ''} />
            {isSelected ? 'Selected' : 'Compare'}
          </button>
          <div className="flex items-center gap-2 group/action">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              View Details
            </span>
            <ArrowRight size={16} className="text-primary translate-x-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Link>
  );
};

export default NameCard;