import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Menu, X, ChevronDown, Home, Package, MessageSquare, Info, Briefcase, MessageCircle } from 'lucide-react';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NAV_LINKS = [
  { name: 'Home', href: '/#home' },
  { name: 'About Us', href: '/#about' },
  { name: 'Products', href: '/#products' },
  { name: 'Why Choose Us', href: '/#why-us' },
  { name: 'Projects / Portfolio', href: '/#portfolio' },
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
            <span className="text-2xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-glare-gradient bg-[length:200%_auto] animate-text-glare">SK</span>
              <span className="bg-clip-text text-transparent bg-gold-gradient ml-1">Korean Technologies</span>
            </span>
          </div>
          
          {/* Desktop Nav - We show a condensed version or a dropdown for so many links, but here we'll show a few and hide rest in menu */}
          <div className="hidden xl:flex items-center space-x-6 text-sm font-medium">
            {NAV_LINKS.slice(0, 5).map(link => (
              <a key={link.name} href={link.href} className="text-foreground hover:text-primary transition-colors">{link.name}</a>
            ))}
            <div className="relative group cursor-pointer flex items-center gap-1 text-foreground hover:text-primary transition-colors">
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
              <div className="absolute top-full right-0 mt-4 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                {NAV_LINKS.slice(5).map(link => (
                  <a key={link.name} href={link.href} className="px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors text-foreground">{link.name}</a>
                ))}
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full bg-border hover:bg-primary/20 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-foreground" />}
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
    <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-all duration-300">
      <div className={`rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300 ${
        isScrolled ? 'bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/20' : 'bg-transparent border border-transparent'
      }`}>
        <a href="/#home" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary dark:text-primary/90 transition-all">
          <Home className="w-5 h-5 dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
          <span className="text-[10px] font-medium dark:text-foreground/80">Home</span>
        </a>
        <a href="/#about" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary dark:text-primary/90 transition-all">
          <Info className="w-5 h-5 dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
          <span className="text-[10px] font-medium dark:text-foreground/80">About</span>
        </a>
        <a href="/#products" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary dark:text-primary/90 transition-all">
          <Package className="w-5 h-5 dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
          <span className="text-[10px] font-medium dark:text-foreground/80">Products</span>
        </a>
        <a href="/#portfolio" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary dark:text-primary/90 transition-all">
          <Briefcase className="w-5 h-5 dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
          <span className="text-[10px] font-medium dark:text-foreground/80">Projects</span>
        </a>
        <a href="/#contact" className="group flex flex-col items-center gap-1 text-foreground/70 hover:text-primary dark:text-primary/90 transition-all">
          <MessageSquare className="w-5 h-5 dark:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
          <span className="text-[10px] font-medium dark:text-foreground/80">Contact</span>
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
      <AboutUs />
      <WhyChooseUs />
      <Portfolio />
      <Products />
      <ContactUs />
    </main>
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
        
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <MobileBottomBar isDark={isDark} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<HomePage loading={loading} setLoading={setLoading} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
