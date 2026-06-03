import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from './components/MainLayout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Pages
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import NameDetail from './components/NameDetailClient.jsx';

// Lazy load other pages
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Compare = lazy(() => import('./pages/Compare.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Disclaimer = lazy(() => import('./pages/Disclaimer.jsx'));
const ReportBug = lazy(() => import('./pages/ReportBug.jsx'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminNames = lazy(() => import('./pages/admin/Names.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/Users.jsx'));
const AdminUpload = lazy(() => import('./pages/admin/Upload.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'));

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout><Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}><Home /></Suspense></MainLayout>} path="/" />
        <Route element={<MainLayout><Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}><Search /></Suspense></MainLayout>} path="/search" />
        <Route element={<MainLayout><Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}><NameDetail /></Suspense></MainLayout>} path="/name/:id" />
        
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Login /></Suspense></MainLayout>} path="/login" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Register /></Suspense></MainLayout>} path="/register" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Account /></Suspense></MainLayout>} path="/account" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Favorites /></Suspense></MainLayout>} path="/favorites" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Compare /></Suspense></MainLayout>} path="/compare" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><FAQ /></Suspense></MainLayout>} path="/faq" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Privacy /></Suspense></MainLayout>} path="/privacy" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Terms /></Suspense></MainLayout>} path="/terms" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><Disclaimer /></Suspense></MainLayout>} path="/disclaimer" />
        <Route element={<MainLayout><Suspense fallback={<div>Loading...</div>}><ReportBug /></Suspense></MainLayout>} path="/report-bug" />

        {/* Admin Routes */}
        <Route element={<Suspense fallback={<div>Loading...</div>}><AdminDashboard /></Suspense>} path="/admin" />
        <Route element={<Suspense fallback={<div>Loading...</div>}><AdminNames /></Suspense>} path="/admin/names" />
        <Route element={<Suspense fallback={<div>Loading...</div>}><AdminUsers /></Suspense>} path="/admin/users" />
        <Route element={<Suspense fallback={<div>Loading...</div>}><AdminUpload /></Suspense>} path="/admin/upload" />
        <Route element={<Suspense fallback={<div>Loading...</div>}><AdminSettings /></Suspense>} path="/admin/settings" />

        <Route element={<MainLayout><div className="text-center py-20"><h1>404 - Page Not Found</h1></div></MainLayout>} path="*" />
      </Routes>
    </>
  );
}

export default App;
