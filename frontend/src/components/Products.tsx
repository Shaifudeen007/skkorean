import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, MessageCircle, Search, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

const ProductCard = ({ product, index, quantity, onAdd, onRemove }: { product: any, index: number, quantity: number, onAdd: () => void, onRemove: () => void }) => {
  const navigate = useNavigate();
  const isSelected = quantity > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`group relative w-full p-3 rounded-[1.5rem] border-[3px] bg-card/60 backdrop-blur-md hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col cursor-pointer ${
        isSelected ? 'border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-border/50'
      }`}
      onClick={() => navigate(`/product/${product._id || product.id}`)}
    >
      {/* Inner Image Container */}
      <div className="relative w-full h-[180px] sm:h-[240px] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-primary/5 mb-3 sm:mb-4">
        <button 
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/50 text-foreground/70 hover:text-primary hover:bg-background'
          }`}
          onClick={(e) => { e.stopPropagation(); if (isSelected) onRemove(); else onAdd(); }}
        >
          {isSelected ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        <img 
          src={product.image ? getImageUrl(product.image) : "https://via.placeholder.com/400x400?text=No+Image"} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-[1rem] sm:rounded-[1.5rem] opacity-90 dark:mix-blend-screen group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
      </div>

      {/* Content Area Below Image */}
      <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] sm:text-xs text-primary font-semibold block">
              {product.category?.name || product.category || 'Uncategorized'}
            </span>
            {product.category?.mainCategory?.name && (
              <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium">
                {product.category.mainCategory.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-2 gap-2 xl:gap-0">
          {(product.price || product.discountPrice || product.mrp) ? (
            <div className="flex flex-col gap-0.5">
              {(product.originalPrice || product.mrp) && (
                <span className="text-[11px] sm:text-xs text-foreground/50 line-through">
                  ₹{product.originalPrice || product.mrp}
                </span>
              )}
              <span className="font-outfit font-bold text-base sm:text-xl text-foreground">
                ₹{product.discountPrice || product.price || product.mrp}
              </span>
            </div>
          ) : (
            <span className="font-outfit font-bold text-sm sm:text-base text-primary uppercase tracking-wider">
              Enquire
            </span>
          )}
          
          {isSelected ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-primary/20 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 w-full xl:w-auto justify-between xl:justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-bold text-lg leading-none pb-0.5"
              >
                -
              </button>
              <span className="font-bold text-sm sm:text-base min-w-[20px] text-center text-foreground">{quantity}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onAdd(); }} 
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-bold text-lg leading-none pb-0.5"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              className="w-full xl:w-auto px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full font-semibold transition-colors text-[10px] sm:text-sm bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
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

const Products = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  
  const [activeMainCategory, setActiveMainCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync active main category from URL hash or search query params
  useEffect(() => {
    let mainParam: string | null = null;
    
    // Check search params (e.g., ?mainCategory=Machineries)
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      mainParam = searchParams.get('mainCategory') || searchParams.get('main');
    }
    
    // Check hash params (e.g., /#products?mainCategory=Machineries)
    if (!mainParam && location.hash && location.hash.includes('?')) {
      const queryString = location.hash.split('?')[1];
      const hashParams = new URLSearchParams(queryString);
      mainParam = hashParams.get('mainCategory') || hashParams.get('main');
    }

    if (mainParam) {
      const decodedParam = decodeURIComponent(mainParam);
      setActiveMainCategory(decodedParam);
      setActiveSubCategory("All");
      setVisibleCount(16);

      // Smooth scroll to products section
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

  // Compute available Sub Categories under current active Main Category
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

  const handleAdd = (id: string) => {
    setSelectedItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[id] > 1) {
        newItems[id] -= 1;
      } else {
        delete newItems[id];
      }
      return newItems;
    });
  };

  const handleWhatsAppCheckout = () => {
    const selectedProducts = safeProductsData.filter(p => selectedItems[p._id || p.id]);
    const message = `Hello SK Korean Technologies! I am interested in exploring pricing and details for the following products:\n\n` + 
                    selectedProducts.map((p, i) => `${i + 1}. ${p.name} (Qty: ${selectedItems[p._id || p.id]})`).join('\n') + 
                    `\n\nPlease provide me with more information.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
  };

  // Filter products by Main Category, Sub Category, and Search Query
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return safeProductsData.filter(p => {
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
  }, [safeProductsData, activeMainCategory, activeSubCategory, searchQuery]);

  if (loading) return <div className="text-center py-20 text-foreground font-semibold">Loading products catalog...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;

  return (
    <section id="products" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-10 text-center"
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              Product Catalog
            </h2>
            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M5,15 Q50,25 95,5" 
                stroke="url(#gold-gradient-svg-products)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="gold-gradient-svg-products" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="50%" stopColor="#E6B830" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="mt-10 text-foreground/70 max-w-2xl text-lg">
            Explore our state-of-the-art collection of Korean aesthetic devices, PMU systems, machinery, and products.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl mt-6 px-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-foreground/50 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, sub categories..."
                className="w-full pl-12 pr-10 py-3 sm:py-3.5 bg-card/80 border border-border/60 rounded-full text-foreground text-sm sm:text-base placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-md shadow-black/5"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 text-foreground/40 hover:text-foreground text-xs font-bold rounded-full bg-border/50 hover:bg-border transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 1. Main Category Tabs (Top Tier) */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 w-full max-w-5xl">
            <button
              onClick={() => {
                setActiveMainCategory("All");
                setActiveSubCategory("All");
                setVisibleCount(16);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeMainCategory === "All"
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-card border border-border/60 text-foreground/70 hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span>All Main Categories</span>
            </button>

            {safeMainCategories.map((mc: any) => (
              <button
                key={mc.id || mc.name}
                onClick={() => {
                  setActiveMainCategory(mc.name);
                  setActiveSubCategory("All");
                  setVisibleCount(16);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMainCategory === mc.name
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-card border border-border/60 text-foreground/70 hover:border-primary/50 hover:text-primary'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{mc.name}</span>
              </button>
            ))}
          </div>

          {/* 2. Sub Category Pills (Second Tier) */}
          {subCategoriesList.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-4xl pt-2">
              <span className="text-xs font-semibold text-foreground/50 self-center mr-1">Sub Categories:</span>
              {subCategoriesList.map(subCat => (
                <button
                  key={subCat}
                  onClick={() => {
                    setActiveSubCategory(subCat);
                    setVisibleCount(16);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeSubCategory === subCat
                      ? 'bg-foreground text-background font-bold shadow-md'
                      : 'bg-card/60 border border-border/40 text-foreground/60 hover:text-foreground hover:border-border'
                  }`}
                >
                  {subCat === "All" ? "All Sub Categories" : subCat}
                </button>
              ))}
            </div>
          )}

        </motion.div>

        {/* Product Cards Grid */}
        <div className="flex flex-col gap-16 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/40 border border-border/50 rounded-3xl max-w-md mx-auto my-4 w-full shadow-lg">
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-foreground/60 text-sm">Try selecting another main category or sub category.</p>
            </div>
          ) : (
            (() => {
              // Group products by Sub Category for clean section display
              const groupedProducts = filteredProducts.reduce((acc, product) => {
                const subCatName = product.category?.name || product.category || 'Uncategorized';
                if (!acc[subCatName]) {
                  acc[subCatName] = [];
                }
                acc[subCatName].push(product);
                return acc;
              }, {} as Record<string, any[]>);

              return Object.entries(groupedProducts).map(([subCategoryName, categoryProducts]) => (
                <div key={subCategoryName} className="w-full">
                  <div className="w-full flex justify-center mb-8">
                    <div className="relative inline-block text-center">
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground pb-3">
                        {subCategoryName}
                      </h3>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    <AnimatePresence mode="popLayout">
                      {categoryProducts.slice(0, visibleCount).map((product, i) => (
                        <ProductCard 
                          key={product._id || product.id} 
                          product={product} 
                          index={i} 
                          quantity={selectedItems[product._id || product.id] || 0}
                          onAdd={() => handleAdd(product._id || product.id)}
                          onRemove={() => handleRemove(product._id || product.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ));
            })()
          )}
        </div>

        {filteredProducts.length > visibleCount && (
          <div className="flex justify-center mt-12 pb-4">
            <button 
              onClick={() => setVisibleCount(prev => prev + 16)}
              className="px-8 py-3 rounded-full bg-card border-2 border-primary/50 text-foreground font-semibold hover:border-primary hover:text-primary transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {Object.keys(selectedItems).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg"
          >
            <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_10px_40px_rgba(212,175,55,0.3)] rounded-full px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="font-outfit font-bold text-foreground text-sm sm:text-base">
                  {Object.values(selectedItems).reduce((a, b) => a + b, 0)} Item{Object.values(selectedItems).reduce((a, b) => a + b, 0) > 1 ? 's' : ''} Selected
                </span>
                <span className="text-[10px] sm:text-xs text-foreground/70">Ready for consultation</span>
              </div>
              <button 
                onClick={handleWhatsAppCheckout}
                className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20 text-xs sm:text-sm whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Enquire Now</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;
