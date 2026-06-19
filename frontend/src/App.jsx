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
import { FallbackLoader } from './components/FallbackLoader';
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Static imports for public routes to avoid Suspense CLS during hydration
import Home from './pages/Home';
import NameDetail from './pages/NameDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import Account from './pages/Account';
// Lazy imports for secondary pages to reduce main bundle size
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const FreeService = lazy(() => import('./pages/FreeService'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ReportBug = lazy(() => import('./pages/ReportBug'));
const Blog = lazy(() => import('./pages/Blog'));

// Lazy Articles
const GirlNamesFArticle = lazy(() => import('./pages/GirlNamesFArticle'));
const BoyQuranicNamesArticle = lazy(() => import('./pages/BoyQuranicNamesArticle'));
const HowToChooseNameArticle = lazy(() => import('./pages/HowToChooseNameArticle'));
const RareBoyNamesArticle = lazy(() => import('./pages/RareBoyNamesArticle'));
const ModernArabicGirlNamesArticle = lazy(() => import('./pages/ModernArabicGirlNamesArticle'));
const NamesMeaningLightArticle = lazy(() => import('./pages/NamesMeaningLightArticle'));
const GirlNamesSArticle = lazy(() => import('./pages/GirlNamesSArticle'));
const CanMuslimsUseNonArabicNamesArticle = lazy(() => import('./pages/CanMuslimsUseNonArabicNamesArticle'));
const NamesOfTheProphetsArticle = lazy(() => import('./pages/NamesOfTheProphetsArticle'));
const TheNameFatimaArticle = lazy(() => import('./pages/TheNameFatimaArticle'));
const ArticleComingSoon = lazy(() => import('./pages/ArticleComingSoon'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNames = lazy(() => import('./pages/admin/AdminNames'));
const AdminUpload = lazy(() => import('./pages/admin/AdminUpload'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminDuplicates = lazy(() => import('./pages/admin/AdminDuplicates').then(m => ({ default: m.AdminDuplicates })));

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

// Prefetch critical recent names API call to resolve the critical request chain latency
const apiBase = import.meta.env.VITE_API_URL || 'https://islamic-web-repo.vercel.app/api/v1';
queryClient.prefetchQuery({
  queryKey: ['names', 'recent'],
  queryFn: () => {
    const promise = window.__recentNamesPromise;
    window.__recentNamesPromise = null;
    return (promise ?? fetch(`${apiBase}/names?sort=-createdAt&limit=8`).then(r => r.json()))
      .then(res => res?.data || res || []);
  },
  staleTime: 5 * 60 * 1000
});


function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>IslamicNames | Meaningful Names. Timeless Legacy.</title>
        <meta name="description" content="Discover thousands of meaningful Islamic names with deep etymology, Quranic references, and historical significance." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.islamicnames.in/" />
        <meta property="og:title" content="IslamicNames | Meaningful Names. Timeless Legacy." />
        <meta property="og:description" content="Discover thousands of meaningful Islamic names with deep etymology, Quranic references, and historical significance." />
        <meta property="og:image" content="https://www.islamicnames.in/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.islamicnames.in/" />
        <meta name="twitter:title" content="IslamicNames | Meaningful Names. Timeless Legacy." />
        <meta name="twitter:description" content="Discover thousands of meaningful Islamic names with deep etymology, Quranic references, and historical significance." />
        <meta name="twitter:image" content="https://www.islamicnames.in/og-image.png" />
      </Helmet>

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
                    <Route path="/login" element={
                      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
                        <Login />
                      </GoogleOAuthProvider>
                    } />
                    <Route path="/register" element={
                      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
                        <Register />
                      </GoogleOAuthProvider>
                    } />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/free-service" element={<FreeService />} />

                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/report-bug" element={<ReportBug />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/50-beautiful-islamic-girl-names-starting-with-f" element={<GirlNamesFArticle />} />
                    <Route path="/blog/top-30-quranic-names-for-baby-boys-in-2026" element={<BoyQuranicNamesArticle />} />
                    <Route path="/blog/how-to-choose-an-islamic-name" element={<HowToChooseNameArticle />} />
                    <Route path="/blog/rare-islamic-boy-names-with-deep-meanings" element={<RareBoyNamesArticle />} />
                    <Route path="/blog/modern-arabic-girl-names-that-sound-beautiful" element={<ModernArabicGirlNamesArticle />} />
                    <Route path="/blog/names-meaning-light-in-the-quran" element={<NamesMeaningLightArticle />} />
                    <Route path="/blog/50-islamic-girl-names-starting-with-s" element={<GirlNamesSArticle />} />
                    <Route path="/blog/can-muslims-use-non-arabic-names" element={<CanMuslimsUseNonArabicNamesArticle />} />
                    <Route path="/blog/names-of-the-prophets-in-islam" element={<NamesOfTheProphetsArticle />} />
                    <Route path="/blog/the-name-fatima-meaning-history" element={<TheNameFatimaArticle />} />
                    <Route path="/blog/:slug" element={<ArticleComingSoon />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="names" element={<AdminNames />} />
                    <Route path="upload" element={<AdminUpload />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="duplicates" element={<AdminDuplicates />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </LazyMotion>
        </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;