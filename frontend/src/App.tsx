import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Menu, X, ChevronDown, Home, Package, MessageSquare, Info, Briefcase, MessageCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Products from './components/Products';
import WhyChooseUs from './components/WhyChooseUs';
import Portfolio from './components/Portfolio';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Admin/Login';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminCategories from './pages/Admin/AdminCategories';
import Dashboard from './pages/Admin/Dashboard';
import Profile from './pages/Admin/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (hash) {
      const cleanHash = hash.split('?')[0];
      const targetId = cleanHash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);

  return null;
};

const MAIN_NAV_ITEMS = [
  { name: 'Home', href: '/#home' },
  { name: 'Machineries', href: '/#products?mainCategory=Machineries' },
  { name: 'PMU Products', href: '/#products?mainCategory=PMU%20Products' },
  { name: 'Aesthetic Products', href: '/#products?mainCategory=Aesthetic%20Products' },
  { name: 'Korean Products', href: '/#products?mainCategory=Korean%20Products' },
  { name: 'About Us', href: '/#about' },
  { name: 'Contact Us', href: '/#contact' },
];

const Navbar = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 font-outfit ${
      isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/#home" className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-glare-gradient bg-[length:200%_auto] animate-text-glare">SK</span>
              <span className="bg-clip-text text-transparent bg-gold-gradient ml-1">Korean Aesthetic Technologies</span>
            </a>
          </div>
          
          <div className="hidden xl:flex items-center space-x-5 text-sm font-medium">
            {MAIN_NAV_ITEMS.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-foreground hover:text-primary transition-colors text-xs font-semibold whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
            
            <button 
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-border hover:bg-primary/20 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-foreground" />}
            </button>
          </div>

          <div className="xl:hidden flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-border/50 hover:bg-primary/20 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileBottomBar = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md transition-all duration-300">
      <div className={`rounded-full px-4 py-3 flex justify-between items-center transition-all duration-300 ${
        isScrolled ? 'bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/20' : 'bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg'
      }`}>
        <a href="/#home" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-medium">Home</span>
        </a>
        <a href="/#products?mainCategory=Machineries" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <Package className="w-4 h-4" />
          <span className="text-[9px] font-medium">Machinery</span>
        </a>
        <a href="/#products?mainCategory=PMU%20Products" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <Layers className="w-4 h-4" />
          <span className="text-[9px] font-medium">PMU</span>
        </a>
        <a href="/#products?mainCategory=Aesthetic%20Products" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <Layers className="w-4 h-4" />
          <span className="text-[9px] font-medium">Aesthetic</span>
        </a>
        <a href="/#products?mainCategory=Korean%20Products" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <Layers className="w-4 h-4" />
          <span className="text-[9px] font-medium">Korean</span>
        </a>
        <a href="/#contact" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-all">
          <MessageSquare className="w-4 h-4" />
          <span className="text-[9px] font-medium">Contact</span>
        </a>
      </div>
    </div>
  );
};

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-1000">
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-primary/15 blur-[80px] md:blur-[120px] mix-blend-screen" />
      <div className="absolute top-[30%] left-[-20%] w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full bg-[#E6B830]/10 blur-[90px] md:blur-[150px] mix-blend-screen" />
      <div className="absolute bottom-[-5%] right-[5%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-primary/15 blur-[70px] md:blur-[100px] mix-blend-screen" />
    </div>
  );
};

const HomePage = ({ loading, setLoading }: { loading: boolean, setLoading: (l: boolean) => void }) => (
  <>
    <AnimatePresence>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
    </AnimatePresence>
    <main id="home">
      <Hero loading={loading} />
      <Portfolio />
      <Products />
      <AboutUs />
      <WhyChooseUs />
      <ContactUs />
    </main>
  </>
);

const PublicLayout = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => (
  <>
    <Navbar isDark={isDark} toggleTheme={toggleTheme} />
    <MobileBottomBar isDark={isDark} toggleTheme={toggleTheme} />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 scroll-smooth relative z-0">
        <BackgroundEffects />
        
        <Routes>
          <Route element={<PublicLayout isDark={isDark} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<HomePage loading={loading} setLoading={setLoading} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>
          
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<Profile />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" theme={isDark ? 'dark' : 'light'} />
      </div>
    </Router>
  );
}

export default App;
