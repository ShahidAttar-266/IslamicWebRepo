import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Home, Users, Database, Upload, Settings, LogOut, ArrowLeft, Menu, X, User } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { name: 'Names', path: '/admin/names', icon: <Database size={20} /> },
    { name: 'Upload', path: '/admin/upload', icon: <Upload size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link to="/admin" className="font-bold text-lg text-primary tracking-tight">IslamicNames Admin</Link>
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="md:hidden p-2 text-text-muted hover:text-text rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                  : 'text-text-muted hover:bg-bg hover:text-text'
              }`}
            >
              <span className={`${isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary'} transition-colors`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-bg/20">
        <div className="px-4 py-4 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-text truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-danger hover:bg-danger/5 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-64 z-[60] md:hidden transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-56 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card h-16 border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden font-bold text-primary">Admin Panel</div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-bg">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Site</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;