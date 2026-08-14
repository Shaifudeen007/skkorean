import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Search, LayoutGrid, List, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index, quantity, onAdd, onRemove, viewMode }: { product: any, index: number, quantity: number, onAdd: () => void, onRemove: () => void, viewMode: 'grid' | 'list' }) => {
  const navigate = useNavigate();
  const isSelected = quantity > 0;

  const getCoverImage = () => {
    if (product.images && Array.isArray(product.images)) {
      const cover = product.images.find((img: any) => img.isCover === true);
      if (cover) return typeof cover === 'string' ? cover : cover.url;
      if (product.images.length > 0) {
        return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
      }
    }
    return product.image;
  };

  const displayImage = getCoverImage();
  const imageUrl = displayImage ? getImageUrl(displayImage) : "https://via.placeholder.com/400x400?text=No+Image";
  
  const hasPrice = product.price || product.discountPrice || product.mrp;
  const currentPrice = product.discountPrice || product.price || product.mrp;
  const originalPrice = product.originalPrice || product.mrp;
  const hasDiscount = originalPrice && currentPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;

  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
        className={`group w-full flex flex-row p-2.5 sm:p-4 rounded-[1.2rem] border-[1.5px] bg-card/80 backdrop-blur-md hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer mb-3 ${
          isSelected ? 'border-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-border/50'
        }`}
        onClick={() => navigate(`/product/${product._id || product.id}`)}
      >
        {/* Left: Image */}
        <div className="relative w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-xl overflow-hidden bg-primary/5 flex-shrink-0">
          <button 
            className={`absolute top-1.5 left-1.5 z-20 p-1.5 rounded-full backdrop-blur-md transition-all ${
              isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/80 text-foreground/70 hover:text-primary hover:bg-background'
            }`}
            onClick={(e) => { e.stopPropagation(); if (isSelected) onRemove(); else onAdd(); }}
          >
            {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <Circle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
          </button>
          


          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500 ease-out" 
            loading="lazy"
          />
        </div>

        {/* Right: Content */}
        <div className="ml-3 sm:ml-5 flex-grow flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[9px] sm:text-xs text-primary font-semibold">
                {product.category?.name || product.category || 'Uncategorized'}
              </span>
            </div>
            <h3 className="font-outfit font-bold text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>

          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1.5 sm:gap-0 mt-auto">
            <span className="font-outfit font-bold text-[10px] sm:text-sm text-primary uppercase tracking-wider drop-shadow-[0_0_5px_rgba(212,175,55,0.8)] animate-pulse">
              Enquire for best price
            </span>

            {isSelected ? (
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-1.5 py-1 sm:px-2">
                <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors font-bold text-xs">-</button>
                <span className="font-bold text-xs sm:text-sm min-w-[16px] text-center">{quantity}</span>
                <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-white transition-colors font-bold text-xs">+</button>
              </div>
            ) : (
              <button 
                className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold transition-colors text-[10px] sm:text-sm bg-foreground text-background hover:bg-primary hover:text-primary-foreground mt-1 sm:mt-0"
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
              >
                View →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (Default)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className={`group relative w-full p-2 sm:p-3 rounded-[1rem] sm:rounded-[1.2rem] border-[1.5px] bg-card/80 backdrop-blur-md hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${
        isSelected ? 'border-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-border/50'
      }`}
      onClick={() => navigate(`/product/${product._id || product.id}`)}
    >
      {/* Inner Image Container */}
      <div className="relative w-full aspect-square rounded-lg sm:rounded-[1rem] overflow-hidden bg-primary/5 mb-2 sm:mb-3">
        <button 
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/70 text-foreground/70 hover:text-primary hover:bg-background'
          }`}
          onClick={(e) => { e.stopPropagation(); if (isSelected) onRemove(); else onAdd(); }}
        >
          {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
        


        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700 ease-out" 
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="px-0.5 pb-1 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-xs sm:text-sm text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-[9px] sm:text-[10px] text-primary font-semibold truncate block">
              {product.category?.name || product.category || 'Uncategorized'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col mt-auto pt-1 gap-1.5">
          <span className="font-outfit font-bold text-[10px] sm:text-[11px] text-primary uppercase tracking-wider drop-shadow-[0_0_5px_rgba(212,175,55,0.8)] animate-pulse">
            Enquire for best price
          </span>
          
          {isSelected ? (
            <div className="flex items-center gap-1 bg-primary/15 rounded-full px-1 py-1 w-full justify-between mt-1">
              <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-background text-foreground hover:bg-primary hover:text-white transition-colors font-bold text-sm">-</button>
              <span className="font-bold text-[10px] sm:text-xs text-foreground">{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-background text-foreground hover:bg-primary hover:text-white transition-colors font-bold text-sm">+</button>
            </div>
          ) : (
            <button 
              className="w-full px-2 py-1.5 sm:py-2 rounded-full font-semibold transition-colors text-[10px] sm:text-xs bg-foreground text-background hover:bg-primary hover:text-primary-foreground mt-1"
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
            >
              Select
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <div className="w-full flex flex-row p-2.5 sm:p-4 rounded-[1.2rem] border border-border/20 bg-card/40 animate-pulse mb-3">
        <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-xl bg-border/30 flex-shrink-0"></div>
        <div className="ml-3 sm:ml-5 flex-grow flex flex-col justify-between py-1">
          <div>
            <div className="h-2 sm:h-3 w-12 sm:w-16 bg-border/30 rounded mb-1.5 sm:mb-2"></div>
            <div className="h-3 sm:h-4 w-3/4 bg-border/40 rounded mb-1.5 sm:mb-2"></div>
            <div className="h-2.5 sm:h-3 w-full bg-border/20 rounded"></div>
          </div>
          <div className="flex justify-between items-end mt-2 sm:mt-4">
            <div className="h-4 sm:h-5 w-16 sm:w-20 bg-border/40 rounded"></div>
            <div className="h-6 sm:h-8 w-16 sm:w-24 bg-border/30 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-3 rounded-[1rem] sm:rounded-[1.2rem] border border-border/20 bg-card/40 animate-pulse">
      <div className="w-full aspect-square rounded-lg sm:rounded-[1rem] bg-border/30 mb-2 sm:mb-3"></div>
      <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-border/30 rounded mb-1.5 sm:mb-2"></div>
      <div className="h-3 sm:h-4 w-full bg-border/40 rounded mb-1.5 sm:mb-2"></div>
      <div className="h-4 sm:h-5 w-12 sm:w-16 bg-border/40 rounded mt-2 sm:mt-4 mb-1.5 sm:mb-2"></div>
      <div className="h-6 sm:h-8 w-full bg-border/30 rounded-full mt-1 sm:mt-2"></div>
    </div>
  );
};

const Catalog = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  
  const { cartItems, addItem, removeItem } = useCart();
  
  const [activeMainCategory, setActiveMainCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for redesign
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('catalogViewMode') as 'grid' | 'list') || 'grid';
  });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getVisibleCount = (subCat: string) => visibleCounts[subCat] || (viewMode === 'list' ? 8 : 12);

  useEffect(() => {
    localStorage.setItem('catalogViewMode', viewMode);
  }, [viewMode]);

  // Sync active main category from URL hash or search query params
  useEffect(() => {
    let mainParam: string | null = null;
    
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      mainParam = searchParams.get('mainCategory') || searchParams.get('main');
    }
    
    if (!mainParam && location.hash && location.hash.includes('?')) {
      const queryString = location.hash.split('?')[1];
      const hashParams = new URLSearchParams(queryString);
      mainParam = hashParams.get('mainCategory') || hashParams.get('main');
    }

    if (mainParam) {
      const decodedParam = decodeURIComponent(mainParam);
      setActiveMainCategory(decodedParam);
      setActiveSubCategory("All");
      setVisibleCounts({});

      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search, location.hash]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsRes, mainCatsRes] = await Promise.all([
          api.get('/products'),
          api.get('/main-categories')
        ]);

        const rawProductsData = productsRes.data;
        const productsList = Array.isArray(rawProductsData) 
          ? rawProductsData 
          : (Array.isArray(rawProductsData?.products) ? rawProductsData.products : (Array.isArray(rawProductsData?.data) ? rawProductsData.data : []));
        
        const rawMainData = mainCatsRes.data;
        let mainList: any[] = [];
        if (Array.isArray(rawMainData)) {
          mainList = rawMainData;
        } else if (Array.isArray(rawMainData?.data)) {
          mainList = rawMainData.data;
        } else if (Array.isArray(rawMainData?.mainCategories)) {
          mainList = rawMainData.mainCategories;
        }

        setProductsData(productsList);
        setMainCategories(mainList);
      } catch (err) {
        setError('Failed to load products catalog. Please try again later.');
        setProductsData([]);
        setMainCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeProductsData = useMemo(() => Array.isArray(productsData) ? productsData : [], [productsData]);
  const safeMainCategories = useMemo(() => Array.isArray(mainCategories) ? mainCategories : [], [mainCategories]);

  const subCategoriesList = useMemo(() => {
    const subSet = new Set<string>();
    
    safeProductsData.forEach((p: any) => {
      const pMain = p.category?.mainCategory?.name;
      const pSub = p.category?.name || p.category;

      if (typeof pSub === 'string') {
        if (activeMainCategory === "All" || pMain === activeMainCategory) {
          subSet.add(pSub);
        }
      }
    });

    return ["All", ...Array.from(subSet)];
  }, [safeProductsData, activeMainCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let result = safeProductsData.filter(p => {
      const pMainCat = p.category?.mainCategory?.name || '';
      const pSubCat = p.category?.name || p.category || '';
      const pName = p.name || '';
      const pDesc = p.description || '';

      const mainMatch = activeMainCategory === "All" || pMainCat === activeMainCategory;
      const subMatch = activeSubCategory === "All" || pSubCat === activeSubCategory;
      const searchMatch = !query || 
        pName.toLowerCase().includes(query) ||
        pSubCat.toLowerCase().includes(query) ||
        pMainCat.toLowerCase().includes(query) ||
        pDesc.toLowerCase().includes(query);

      return mainMatch && subMatch && searchMatch;
    });

    // Sorting
    result.sort((a, b) => {
      const getPrice = (p: any) => p.discountPrice || p.price || p.mrp || 0;
      
      switch(sortBy) {
        case 'price_low_high':
          return getPrice(a) - getPrice(b);
        case 'price_high_low':
          return getPrice(b) - getPrice(a);
        case 'name_a_z':
          return (a.name || '').localeCompare(b.name || '');
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'featured':
        default:
          return 0;
      }
    });

    return result;
  }, [safeProductsData, activeMainCategory, activeSubCategory, searchQuery, sortBy]);

  // Handle body scroll locking when mobile filter drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen]);

  return (
    <section id="products" className="pt-20 sm:pt-24 pb-12 relative min-h-screen bg-background">
      {/* Mobile Sticky Top Bar (Search + View Toggle + Filters btn) */}
      <div className="sticky top-[60px] md:top-[80px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 lg:hidden flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 w-full">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2.5 bg-card border border-border/60 rounded-full text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter/Sort Button */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="p-2.5 border border-border/60 rounded-full bg-card hover:bg-border/50 text-foreground transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 lg:mt-4">
        
        {/* Desktop Header & Controls (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col mb-8 w-full bg-transparent">
          <div className="flex justify-between items-end w-full mb-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">
                Product Catalog
              </h2>
            </div>
            
            {/* View Toggle (Desktop) */}
            <div className="flex items-center bg-card/80 border border-border/60 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 w-full bg-card/40 p-3 rounded-2xl border border-border/50">
            {/* Desktop Search */}
            <div className="relative w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border/60 rounded-full text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Sorting */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground/70">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border/60 text-sm rounded-full px-4 py-2 focus:outline-none focus:border-primary text-foreground cursor-pointer appearance-none min-w-[150px]"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="name_a_z">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4 lg:mt-0">
          
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-[250px] shrink-0">
            <div className="sticky top-[100px] bg-card/40 border border-border/50 rounded-3xl p-5">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border/50">Categories</h3>
              
              <div className="flex flex-col gap-2 mb-6">
                <button 
                  onClick={() => { setActiveMainCategory("All"); setActiveSubCategory("All"); setVisibleCounts({}); }}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${activeMainCategory === "All" ? "bg-primary/10 text-primary font-bold" : "hover:bg-border/40 text-foreground"}`}
                >
                  All Categories
                </button>
                {safeMainCategories.map((mc: any) => (
                  <button 
                    key={mc.id || mc.name}
                    onClick={() => { setActiveMainCategory(mc.name); setActiveSubCategory("All"); setVisibleCounts({}); }}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${activeMainCategory === mc.name ? "bg-primary/10 text-primary font-bold" : "hover:bg-border/40 text-foreground"}`}
                  >
                    {mc.name}
                  </button>
                ))}
              </div>

              {subCategoriesList.length > 1 && (
                <>
                  <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border/50 mt-6">Subcategories</h3>
                  <div className="flex flex-col gap-2">
                    {subCategoriesList.map(subCat => (
                      <button 
                        key={subCat}
                        onClick={() => { setActiveSubCategory(subCat); setVisibleCounts({}); }}
                        className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${activeSubCategory === subCat ? "bg-primary/10 text-primary font-bold" : "hover:bg-border/40 text-foreground"}`}
                      >
                        {subCat === "All" ? "All Subcategories" : subCat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow w-full min-w-0 pb-10">
            
            {/* Mobile Category Chips (Horizontal Scroll) */}
            <div className="lg:hidden w-full mb-3 px-1">
              <div className="overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-2 min-w-max">
                  <button 
                    onClick={() => { setActiveMainCategory("All"); setActiveSubCategory("All"); setVisibleCounts({}); }}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors border whitespace-nowrap shadow-sm ${activeMainCategory === "All" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-foreground"}`}
                  >
                    All Categories
                  </button>
                  {safeMainCategories.map((mc: any) => (
                    <button 
                      key={mc.id || mc.name}
                      onClick={() => { setActiveMainCategory(mc.name); setActiveSubCategory("All"); setVisibleCounts({}); }}
                      className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors border whitespace-nowrap shadow-sm ${activeMainCategory === mc.name ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60 text-foreground"}`}
                    >
                      {mc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Categories Chips */}
              {subCategoriesList.length > 1 && (
                <div className="overflow-x-auto mt-3 pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex gap-2 min-w-max">
                    {subCategoriesList.map(subCat => (
                      <button 
                        key={subCat}
                        onClick={() => { setActiveSubCategory(subCat); setVisibleCounts({}); }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap ${activeSubCategory === subCat ? "bg-primary/20 text-primary border-primary/30" : "bg-background border-border/40 text-foreground/80"}`}
                      >
                        {subCat === "All" ? "All Subcategories" : subCat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View Toggle & Info (Below chips) */}
            <div className="lg:hidden flex items-center justify-between mb-4 mt-2 px-1">
              <span className="text-xs text-foreground/60 font-medium">
                {loading ? 'Loading...' : `${filteredAndSortedProducts.length} Products`}
              </span>
              
              <div className="flex items-center bg-card border border-border/60 rounded-full p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-foreground/50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-foreground/50'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Product List/Grid */}
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center items-center py-20 w-full">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/20 rounded-3xl w-full border border-border/30">
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                  <p className="text-foreground/60 text-sm mb-6 max-w-xs">
                    Try changing your search or filters to find what you're looking for.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveMainCategory('All');
                      setActiveSubCategory('All');
                    }}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                (() => {
                  const groupedProducts = filteredAndSortedProducts.reduce((acc, product) => {
                    const subCatName = product.category?.name || product.category || 'Uncategorized';
                    if (!acc[subCatName]) {
                      acc[subCatName] = [];
                    }
                    acc[subCatName].push(product);
                    return acc;
                  }, {} as Record<string, any[]>);

                  return Object.entries(groupedProducts).map(([subCategoryName, categoryProducts]) => (
                    <div key={subCategoryName} className="w-full mb-8 sm:mb-10">
                      {(activeSubCategory === "All" && Object.keys(groupedProducts).length > 1) && (
                        <h4 className="text-lg sm:text-2xl font-serif font-bold text-foreground mb-3 sm:mb-4 pl-1">
                          {subCategoryName}
                        </h4>
                      )}
                      
                      <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5" : "flex flex-col gap-0"}>
                        <AnimatePresence mode="popLayout">
                          {categoryProducts.slice(0, getVisibleCount(subCategoryName)).map((product, i) => (
                            <ProductCard 
                              key={product._id || product.id} 
                              product={product} 
                              index={i} 
                              quantity={cartItems[product._id || product.id]?.quantity || 0}
                              onAdd={() => addItem(product)}
                              onRemove={() => removeItem(product._id || product.id)}
                              viewMode={viewMode}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                      
                      {categoryProducts.length > getVisibleCount(subCategoryName) && (
                        <div className="flex justify-center mt-6">
                          <button 
                            onClick={() => setVisibleCounts(prev => ({ ...prev, [subCategoryName]: getVisibleCount(subCategoryName) + (viewMode === 'list' ? 8 : 12) }))}
                            className="px-6 py-2.5 rounded-full bg-card border border-border/60 text-foreground text-xs sm:text-sm font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
                          >
                            Load More
                          </button>
                        </div>
                      )}
                    </div>
                  ));
                })()
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-background z-[101] rounded-t-3xl shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-bold text-lg">Filters & Sort</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full bg-card border border-border/50 text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-5">
                <div className="mb-8">
                  <h4 className="font-semibold text-xs text-foreground/70 mb-3 uppercase tracking-wider">Sort By</h4>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: 'featured', label: 'Featured' },
                      { id: 'newest', label: 'Newest Arrivals' },
                      { id: 'price_low_high', label: 'Price: Low to High' },
                      { id: 'price_high_low', label: 'Price: High to Low' },
                      { id: 'name_a_z', label: 'Name: A to Z' }
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/40 bg-card/40 cursor-pointer transition-colors hover:bg-border/30">
                        <input 
                          type="radio" 
                          name="mobile_sort" 
                          value={opt.id}
                          checked={sortBy === opt.id}
                          onChange={() => setSortBy(opt.id)}
                          className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-xs text-foreground/70 mb-3 uppercase tracking-wider">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => { setActiveMainCategory("All"); setActiveSubCategory("All"); }}
                      className={`px-4 py-2.5 rounded-full text-[13px] font-semibold border ${activeMainCategory === "All" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border/60"}`}
                    >
                      All
                    </button>
                    {safeMainCategories.map((mc: any) => (
                      <button 
                        key={mc.id || mc.name}
                        onClick={() => { setActiveMainCategory(mc.name); setActiveSubCategory("All"); }}
                        className={`px-4 py-2.5 rounded-full text-[13px] font-semibold border ${activeMainCategory === mc.name ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border/60"}`}
                      >
                        {mc.name}
                      </button>
                    ))}
                  </div>
                </div>

                {subCategoriesList.length > 1 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-xs text-foreground/70 mb-3 uppercase tracking-wider">Subcategories</h4>
                    <div className="flex flex-wrap gap-2">
                      {subCategoriesList.map(subCat => (
                        <button 
                          key={subCat}
                          onClick={() => setActiveSubCategory(subCat)}
                          className={`px-4 py-2.5 rounded-full text-xs font-medium border ${activeSubCategory === subCat ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border/60"}`}
                        >
                          {subCat === "All" ? "All Subcategories" : subCat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border/50 bg-background flex gap-3 sticky bottom-0">
                <button 
                  onClick={() => {
                    setSortBy('featured');
                    setActiveMainCategory('All');
                    setActiveSubCategory('All');
                  }}
                  className="w-1/3 py-3.5 rounded-xl border border-border/60 text-foreground font-semibold text-sm text-center transition-colors hover:bg-border/50"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-2/3 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm text-center shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
                >
                  Show {filteredAndSortedProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Catalog;
