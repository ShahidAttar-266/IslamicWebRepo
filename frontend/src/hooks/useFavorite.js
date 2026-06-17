import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const useFavorite = (nameIdOrObj) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const nameId = typeof nameIdOrObj === 'object' ? nameIdOrObj?._id : nameIdOrObj;
  const nameObj = typeof nameIdOrObj === 'object' ? nameIdOrObj : null;

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/users/favorites');
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  const isFavorited = favorites?.some((f) => f._id === nameId) || false;

  // Retrieve name object from cache if not passed directly
  const resolvedNameObj = nameObj || queryClient.getQueryData(['name', nameId]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!nameId) return;
      if (isFavorited) {
        return api.delete(`/users/favorites/${nameId}`);
      } else {
        return api.post(`/users/favorites/${nameId}`);
      }
    },
    onMutate: async () => {
      if (!nameId) return;

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(['favorites']);

      // Optimistically update to the new value
      queryClient.setQueryData(['favorites'], (old) => {
        const currentList = old || [];
        if (isFavorited) {
          return currentList.filter((f) => f._id !== nameId);
        } else {
          const newFavorite = resolvedNameObj || {
            _id: nameId,
            nameEnglish: 'Loading...',
            nameArabic: '',
            gender: 'boy',
          };
          return [...currentList, newFavorite];
        }
      });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
      toast.error(err.response?.data?.error || 'Could not update favorites');
    },
    onSuccess: () => {
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggleFavorite = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  return {
    isFavorited,
    toggleFavorite,
    isPending: toggleFavoriteMutation.isPending,
    isLoadingFavorites: isLoading,
  };
};

export default useFavorite;
