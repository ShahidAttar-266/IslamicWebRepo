import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Search, LogOut, Heart, Menu, X, ChevronRight, User } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import SupportWidget from '../components/SupportWidget';

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close drawer and dropdown on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

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
    { name: 'Premium', path: '/pricing' },
    ...(isAuthenticated ? [{ name: 'Compare', path: '/compare' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      {/* Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center overflow-hidden rounded-lg bg-bg/50 border border-border/50 group-hover:border-primary/50 transition-colors">
                <img src={logo} alt="Logo" width="40" height="40" loading="eager" className="h-full w-full object-cover" />
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
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/search" className="p-2.5 md:p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Search size={20} />
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-1 md:gap-3">
                <Link to="/favorites" className="p-2.5 md:p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Heart size={20} />
                </Link>
                
                {/* Desktop Dropdown */}
                <div className="relative hidden md:block">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                          <p className="text-xs text-text-muted capitalize">{user?.subscription?.status || 'Free'} Plan</p>
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
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2.5 hover:bg-bg rounded-lg text-text hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-card border-l border-border z-[70] md:hidden transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" width="32" height="32" className="h-8 w-8" />
              <span className="font-bold text-lg text-primary">IslamicNames</span>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-bg rounded-lg text-text-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={24} />
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
                      <p className="text-xs text-text-muted capitalize">{user?.subscription?.status || 'Free'} Plan</p>
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
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Support Widget */}
      <SupportWidget />
    </div>
  );
};

export default MainLayout;