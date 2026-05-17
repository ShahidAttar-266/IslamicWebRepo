import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/useAuthStore';
import { Loader2 } from 'lucide-react';
import ScrollToTop from './components/ScrollToTop';
import { LazyMotion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy load Framer Motion features
const loadFeatures = () => import('framer-motion').then(res => res.domAnimation);

// Layouts
import MainLayout from './layouts/MainLayout';
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Lazy Pages
import Home from './pages/Home';
import NameDetail from './pages/NameDetail';
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Compare = lazy(() => import('./pages/Compare'));
const Account = lazy(() => import('./pages/Account'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Refund = lazy(() => import('./pages/Refund'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Success = lazy(() => import('./pages/Success'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ReportBug = lazy(() => import('./pages/ReportBug'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNames = lazy(() => import('./pages/admin/AdminNames'));
const AdminUpload = lazy(() => import('./pages/admin/AdminUpload'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false, // Prevents refetching when user switches tabs
      retry: 1,                    // Only retry once on failure
    },
  },
});

function App() {
  const FallbackLoader = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-medium text-text-muted animate-pulse">Loading IslamicNames...</p>
    </div>
  );

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={loadFeatures} strict>
          <Router>
            <ScrollToTop />
            <Toaster position="top-center" toastOptions={{ className: 'bg-card text-text' }} />
            <Suspense fallback={<FallbackLoader />}>
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
                  <Route path="/cancellation" element={<Refund />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/report-bug" element={<ReportBug />} />
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
            </Suspense>
          </Router>
        </LazyMotion>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;