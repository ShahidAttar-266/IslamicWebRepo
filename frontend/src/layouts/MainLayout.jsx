import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Search, LogOut, Heart, Menu, X, ChevronRight, User, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import { AnnouncementBar } from '../components/AnnouncementBar';

// Lazy Components
const SupportWidget = lazy(() => import('../components/SupportWidget'));

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const menuButtonRef = useRef(null);
  const prevIsDrawerOpen = useRef(false);

  useEffect(() => {
    // Mount after browser finishes first paint or after 3 seconds
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setShowWidget(true), { timeout: 3000 })
      : setTimeout(() => setShowWidget(true), 3000);

    return () => window.cancelIdleCallback
      ? window.cancelIdleCallback(id)
      : clearTimeout(id);
  }, []);

  // Close drawer and dropdown on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawerOpen(false);
      setIsDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Accessibility: Return focus to menu button when drawer closes
  useEffect(() => {
    if (prevIsDrawerOpen.current && !isDrawerOpen) {
      menuButtonRef.current?.focus();
    }
    prevIsDrawerOpen.current = isDrawerOpen;
  }, [isDrawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '?';

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Names', path: '/search' },
    ...(isAuthenticated ? [{ name: 'Compare', path: '/compare' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      {/* Sticky shell: announcement bar + navbar scroll as one unit */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        {/* Navbar */}
        <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center overflow-hidden rounded-lg bg-bg/50 border border-border/50 group-hover:border-primary/50 transition-colors">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/logo-40.webp 40w, /logo-80.webp 80w, /logo-120.webp 120w"
                    sizes="(min-resolution: 2dppx) 80px, 40px"
                  />
                  <img 
                    src="/logo-40.png" 
                    srcSet="/logo-40.png 40w, /logo-80.png 80w"
                    alt="" 
                    width={40} 
                    height={40} 
                    loading="eager" 
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover" 
                  />
                </picture>
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-primary">IslamicNames</span>
            </Link>
            
            <nav className="hidden md:flex gap-4 text-sm font-medium text-text-muted">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive(link.path) ? 'bg-primary/10 text-primary' : 'hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/blog"
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive('/blog') ? 'bg-primary/10 text-primary' : 'hover:text-primary'
                }`}
              >
                <BookOpen size={15} />
                Articles
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/search" 
              aria-label="Search Islamic names"
              className="p-2.5 md:p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Search size={20} aria-hidden="true" />
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-1 md:gap-3">
                <Link 
                  to="/favorites" 
                  aria-label="View your favorite names"
                  className="p-2.5 md:p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Heart size={20} aria-hidden="true" />
                </Link>
                
                {/* Desktop Dropdown */}
                <div className="relative hidden md:block">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="Toggle user menu"
                    aria-expanded={isDropdownOpen}
                    className="flex items-center gap-2 p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                      {userInitial}
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                        <div className="p-3 border-b border-border bg-bg/50">
                          <p className="font-medium text-sm text-text truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                        <Link to="/account" className="block w-full text-left px-4 py-3 text-sm text-text hover:bg-bg transition-colors flex items-center justify-between group">
                          My Profile
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        {user?.role === 'admin' && (
                           <Link to="/admin" className="block w-full text-left px-4 py-3 text-sm text-text hover:bg-bg transition-colors flex items-center justify-between group">
                            Admin Dashboard
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        )}
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-danger hover:bg-bg transition-colors flex items-center gap-2 border-t border-border">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-text hover:text-primary transition-colors px-3 py-2">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-opacity-90 text-bg px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/10">Sign Up</Link>
              </div>
            )}

            {/* Hamburger Button */}
            <button 
              ref={menuButtonRef}
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2.5 hover:bg-bg rounded-lg text-text hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
        </header>
      </div>{/* end sticky shell */}

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-card border-l border-border z-[70] md:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsDrawerOpen(false)}>
            <picture>
              <source
                type="image/webp"
                srcSet="/logo-40.webp 40w, /logo-80.webp 80w"
                sizes="32px"
              />
              <img 
                src="/logo-40.png" 
                alt="" 
                width={32} 
                height={32} 
                loading="eager" 
                decoding="async"
                className="h-8 w-8" 
              />
            </picture>
            <span className="font-bold text-lg text-primary">IslamicNames</span>
          </Link>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 hover:bg-bg rounded-lg text-text-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive(link.path) 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-text-muted hover:bg-bg hover:text-text'
                }`}
              >
                {link.name}
                {isActive(link.path) && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            ))}
              <Link
                to="/blog"
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive('/blog') 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-text-muted hover:bg-bg hover:text-text'
                }`}
              >
                <span className="flex items-center gap-2"><BookOpen size={18} /> Articles</span>
                {isActive('/blog') && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
          </nav>

          <div className="mt-8 px-4">
            <div className="h-px bg-border w-full mb-8" />
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                    {userInitial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-text truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                  </div>
                </div>
                
                <Link to="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg hover:text-text transition-all">
                  <User size={20} />
                  <span>My Profile</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg hover:text-text transition-all">
                    <Search size={20} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-danger hover:bg-danger/5 transition-all mt-4"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="flex items-center justify-center w-full py-3.5 rounded-xl border border-border font-semibold hover:bg-bg transition-all">
                  Login
                </Link>
                <Link to="/register" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-bg font-bold shadow-lg shadow-primary/20 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 text-center text-xs text-text-muted border-t border-border">
          &copy; {new Date().getFullYear()} IslamicNames. All rights reserved.
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Support Widget */}
      {showWidget && (
        <Suspense fallback={null}>
          <SupportWidget />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;