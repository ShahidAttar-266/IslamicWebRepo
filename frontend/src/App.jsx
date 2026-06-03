import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './components/ScrollToTop';
import { LazyMotion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { HelmetProvider, Helmet } from 'react-helmet-async';

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
const Favorites = lazy(() => import('./pages/Favorites'));
const Compare = lazy(() => import('./pages/Compare'));
const Account = lazy(() => import('./pages/Account'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ReportBug = lazy(() => import('./pages/ReportBug'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNames = lazy(() => import('./pages/admin/AdminNames'));
const AdminUpload = lazy(() => import('./pages/admin/AdminUpload'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
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

const FallbackLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 space-y-4">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    <p className="text-sm font-medium text-text-muted animate-pulse">Loading IslamicNames...</p>
  </div>
);

function App() {

  return (
    <HelmetProvider>
      <Helmet>
        <title>Islamic Names | Meaningful Names for Boys & Girls | IslamicNames</title>
        <meta name="description" content="Discover thousands of meaningful Islamic names for boys and girls. Search by Quranic reference, Arabic roots, and historical significance. Explore Islamic names with meanings today." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.islamicnames.in/" />
        <meta property="og:title" content="Islamic Names | Meaningful Names for Boys & Girls" />
        <meta property="og:description" content="Explore thousands of authentic Islamic names with meanings, Quranic references, and historical contexts. Free for everyone." />
        <meta property="og:image" content="https://www.islamicnames.in/logo-120.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.islamicnames.in/" />
        <meta property="twitter:title" content="Islamic Names | Meaningful Names for Boys & Girls" />
        <meta property="twitter:description" content="Explore thousands of authentic Islamic names with meanings, Quranic references, and historical contexts." />
        <meta property="twitter:image" content="https://www.islamicnames.in/logo-120.webp" />
      </Helmet>

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
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
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </LazyMotion>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;
