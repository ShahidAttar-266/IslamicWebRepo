import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import NameDetail from './pages/NameDetail';
import Pricing from './pages/Pricing';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import Account from './pages/Account';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Disclaimer from './pages/Disclaimer';
import Success from './pages/Success';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNames from './pages/admin/AdminNames';
import AdminUpload from './pages/admin/AdminUpload';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminSettings from './pages/admin/AdminSettings';

import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 10,    // 10 minutes
      retry: 1,
    },
  },
});

function App() {
  const { setLoaded, isLoaded } = useAuthStore();

  useEffect(() => {
    // Zustand persist (localStorage) already restores user + token on load.
    // We do NOT call /auth/me here — that relied on cookies which are blocked
    // cross-origin (Netlify → Vercel). Calling it would wipe the token.
    // onRehydrateStorage in useAuthStore sets isLoaded=true after rehydration,
    // but as a fallback we set it here too after a short tick.
    const timer = setTimeout(() => {
      setLoaded();
    }, 100);
    return () => clearTimeout(timer);
  }, [setLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-text-muted font-medium">Initializing...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          <Toaster position="top-center" toastOptions={{ className: 'bg-card text-text' }} />
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/name/:id" element={<NameDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/account" element={<Account />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/success" element={<Success />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="names" element={<AdminNames />} />
              <Route path="upload" element={<AdminUpload />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;