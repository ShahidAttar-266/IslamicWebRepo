import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import NameCard from '../components/NameCard';
import { HeartCrack, Download, Loader2, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { exportFavoritesToPDF } from '../api/pdfExport';
import useAuthStore from '../store/useAuthStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
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
    const isPremium = user?.role === 'admin' || user?.subscription?.status === 'premium';
    
    if (!isPremium) {
      toast.error('PDF Export is a Premium feature', {
        icon: <Crown className="text-amber-500" />
      });
      return;
    }

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

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">My Favorites</h1>
          <p className="text-text-muted">You have {favorites?.length || 0} saved names.</p>
        </div>
        
        <button 
          onClick={handleExport} 
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary text-text px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 group"
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
          )}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </button>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <HeartCrack size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
          <h3 className="text-xl font-bold text-text mb-2">No favorites yet</h3>
          <p className="text-text-muted">Browse the directory and click the heart icon to save names here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(name => (
            <div key={name._id} className="relative group">
              <NameCard name={name} />
              <button 
                onClick={() => removeFavoriteMutation.mutate(name._id)}
                className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur border border-border rounded-full text-danger opacity-0 group-hover:opacity-100 transition-all hover:bg-danger hover:text-white"
                title="Remove"
              >
                <HeartCrack size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;