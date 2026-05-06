import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Search, LogOut, Heart } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '?';

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      {/* Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-lg bg-bg/50 border border-border/50">
                <img src={logo} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-primary">NoorNames</span>
            </Link>
            
            <nav className="hidden md:flex gap-4 text-sm font-medium text-text-muted">
              <Link to="/search" className="hover:text-primary transition-colors">Browse</Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">Premium</Link>
              {isAuthenticated && (
                <Link to="/compare" className="hover:text-primary transition-colors">Compare</Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/search" className="p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors">
              <Search size={20} />
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/favorites" className="p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors">
                  <Heart size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-bg rounded-full text-text-muted hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                      {userInitial}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-border">
                      <p className="font-medium text-sm text-text truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-text-muted capitalize">{user?.subscription?.status || 'Free'} Plan</p>
                    </div>
                    <Link to="/account" className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-bg transition-colors">My Profile</Link>
                    {user?.role === 'admin' && (
                       <Link to="/admin" className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-bg transition-colors">Admin Dashboard</Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-bg transition-colors flex items-center gap-2 rounded-b-lg">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-text hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-opacity-90 text-bg px-4 py-2 rounded-lg text-sm font-bold transition-all">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;