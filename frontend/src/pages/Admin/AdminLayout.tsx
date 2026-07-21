import React, { useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  Lock, 
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: Package },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  ];

  const adminInfoStr = localStorage.getItem('adminInfo');
  const adminName = adminInfoStr ? JSON.parse(adminInfoStr).name : 'Admin';
  
  // Breadcrumbs generation
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-outfit">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="h-20 flex items-center px-6 border-b border-border">
          <span className="text-2xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-glare-gradient bg-[length:200%_auto] animate-text-glare">SK</span>
            <span className="bg-clip-text text-transparent bg-gold-gradient ml-1">Admin</span>
          </span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-md text-foreground/70 hover:bg-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-foreground/70 hover:bg-border/50 hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-foreground/50'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/admin/profile"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-foreground/70 hover:bg-border/50 hover:text-foreground"
          >
            <Settings className="w-5 h-5 text-foreground/50" />
            Settings
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-foreground/70 hover:bg-border/50 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center text-sm font-medium text-foreground/60">
              <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
              {pathnames.slice(1).map((value, index) => {
                const to = `/admin/${pathnames.slice(1, index + 2).join('/')}`;
                const isLast = index === pathnames.length - 2;
                return (
                  <React.Fragment key={to}>
                    <ChevronRight className="w-4 h-4 mx-2 text-foreground/40" />
                    {isLast ? (
                      <span className="text-foreground capitalize">{value.replace('-', ' ')}</span>
                    ) : (
                      <Link to={to} className="hover:text-primary transition-colors capitalize">{value.replace('-', ' ')}</Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-border/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">{adminName}</p>
                <p className="text-xs text-foreground/60 mt-1">Administrator</p>
              </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg shadow-black/20 z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <Link 
                        to="/admin/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link 
                        to="/admin/change-password" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                        Change Password
                      </Link>
                      <div className="h-px bg-border my-2" />
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;
