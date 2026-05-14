import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Book, Crown, ArrowRight, ArrowLeftRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const NameCard = ({ name, onFavorite, delay = 0, isLocked = false }) => {
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

    if (isLocked) {
      navigate('/login');
      return;
    }

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

    navigate(`/compare?${params.toString()}`);
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
    if (isLocked) {
      navigate('/login');
      return;
    }
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

  const CardContent = (
    <div className={`relative z-10 flex flex-col h-full ${isLocked ? 'blur-sm select-none pointer-events-none' : ''}`}>
      {/* Top Header: Arabic Name & Favorite Action */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-3xl md:text-4xl font-arabic text-primary leading-none group-hover:scale-110 transition-transform duration-500 origin-left">
          {name.nameArabic}
        </div>
        <button 
          onClick={handleFavoriteClick}
          aria-label={favoriteMutation.isPending ? "Adding to favorites" : "Add to favorites"}
          className="p-2 rounded-full bg-bg/50 border border-border text-text-muted hover:text-danger hover:border-danger/30 transition-all duration-300 min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <Heart size={18} aria-hidden="true" fill={favoriteMutation.isPending ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Middle: English Name & Main Badge */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-text group-hover:text-primary transition-colors duration-300 truncate">
            {name.nameEnglish}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border shrink-0 ${genderStyles}`}>
            {name.gender}
          </span>
        </div>
        
        {/* Secondary Badges */}
        <div className="flex flex-wrap gap-2">
          {(name.isQuranic || name.quranReference?.surah) && (
            <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase tracking-tighter shrink-0">
              <Book size={10} aria-hidden="true" /> Quranic
            </span>
          )}
          {name.isPremium && (
            <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-tighter shrink-0">
              <Crown size={10} aria-hidden="true" /> Premium
            </span>
          )}
        </div>
      </div>

      {/* Meaning Section */}
      <div className="relative flex-1">
        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed italic pr-4">
          "{name.meaning}"
        </p>
      </div>
      
      {/* Footer: Detailed Action */}
      <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center group-hover:border-primary/20 transition-colors gap-2">
        <button 
          onClick={handleCompare}
          aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
          className={`flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em] transition-colors shrink-0 ${
            isSelected ? 'text-accent' : 'text-text-muted hover:text-primary'
          }`}
        >
          <ArrowLeftRight size={14} aria-hidden="true" className={isSelected ? 'animate-pulse' : ''} />
          <span className="hidden xs:inline">{isSelected ? 'Selected' : 'Compare'}</span>
          <span className="xs:hidden">{isSelected ? 'Sel.' : 'Comp.'}</span>
        </button>
        <div className="flex items-center gap-1.5 group/action shrink-0">
          <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-wider md:tracking-[0.2em]">
            Details
          </span>
          <ArrowRight size={16} className="text-primary translate-x-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  const cardClasses = "group relative bg-card border border-border rounded-2xl p-4 md:p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden flex flex-col h-full";

  if (isLocked) {
    return (
      <div 
        className={cardClasses}
        style={{ animationDelay: `${delay}s` }}
      >
        {CardContent}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-bg/40 backdrop-blur-[2px]">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Crown className="text-primary" size={24} />
          </div>
          <h4 className="text-lg font-bold text-text mb-2">Login Required</h4>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Please login to view full details of this name and access the library.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-primary text-bg py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Login to View
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`/name/${name._id}`} 
      className={cardClasses}
      style={{ animationDelay: `${delay}s` }}
      aria-label={`${name.nameEnglish} — ${name.gender} name`}
    >
      {/* Decorative Arabic Background Letter */}
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
        <span className="text-7xl md:text-8xl font-arabic select-none pointer-events-none">
          {name.nameArabic.charAt(0)}
        </span>
      </div>

      {CardContent}

      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Link>
  );
};

export default NameCard;