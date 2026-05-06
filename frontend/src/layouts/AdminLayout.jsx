import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Home, Users, Database, Upload, CreditCard, Settings, LogOut, ArrowLeft, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { name: 'Names', path: '/admin/names', icon: <Database size={20} /> },
    { name: 'Upload', path: '/admin/upload', icon: <Upload size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: <CreditCard size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <span className="font-bold text-lg text-primary">NoorNames Admin</span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-text-muted hover:text-text">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-bg' : 'text-text-muted hover:bg-bg hover:text-text'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            logout();
          }} 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-danger hover:bg-bg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 md:hidden transition-transform duration-300 flex flex-col ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-text-muted hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden font-bold text-primary">Admin Panel</div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <div className="h-8 w-8 bg-primary text-bg rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;