
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { HeartCrack, Download, Loader2, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import NameCard from '@/components/NameCard';
import { exportFavoritesToPDF } from '@/api/pdfExport';

const Favorites = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/users/favorites');
      return res.data.data;
    },
    enabled: isAuthenticated
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    }
  });

  const handleExport = async () => {
    if (!favorites || favorites.length === 0) {
      toast.error('No favorites to export');
      return;
    }

    try {
      setIsExporting(true);
      await exportFavoritesToPDF(favorites);
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p className="text-text-muted font-bold text-sm animate-pulse">Loading favorites...</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 px-1">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-text mb-2">My Favorites</h1>
          <p className="text-sm md:text-base text-text-muted italic">You have <span className="text-primary font-bold">{favorites?.length || 0}</span> saved names.</p>
        </div>
        
        <button 
          onClick={handleExport} 
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary text-text px-8 py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 group min-h-[44px] w-full md:w-auto shadow-lg shadow-black/5 uppercase tracking-widest"
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform text-primary" />
          )}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </button>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-16 md:py-24 bg-card border border-border rounded-3xl shadow-inner px-4">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-bg border border-border rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted opacity-40">
            <HeartCrack size={32} className="md:size-48" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-text mb-3">No favorites yet</h3>
          <p className="text-sm md:text-base text-text-muted max-w-md mx-auto leading-relaxed italic">
            Start building your collection! Browse the directory and tap the heart icon to save names you love.
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="mt-8 bg-primary text-bg px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            Explore Names
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {favorites.map(name => (
            <div key={name._id} className="relative group">
              <NameCard name={name} />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeFavoriteMutation.mutate(name._id);
                }}
                className="absolute top-4 right-4 p-2.5 bg-card/80 backdrop-blur-md border border-border rounded-full text-danger opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-danger hover:text-white shadow-lg min-w-[36px] min-h-[36px] flex items-center justify-center z-20"
                title="Remove from favorites"
              >
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
