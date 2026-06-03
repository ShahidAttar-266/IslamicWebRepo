

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation);

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={loadFeatures} strict>
          {children}
          <Toaster position="top-center" toastOptions={{ className: 'bg-card text-text' }} />
        </LazyMotion>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
