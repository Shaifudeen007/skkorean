import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CheckCircle2, Circle, MessageCircle, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

const ProductCard = ({ product, index, quantity, onAdd, onRemove }: { product: any, index: number, quantity: number, onAdd: () => void, onRemove: () => void }) => {
  const navigate = useNavigate();
  const isSelected = quantity > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative w-full p-3 rounded-[2rem] border-[3px] bg-card/60 backdrop-blur-md hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col cursor-pointer ${
        isSelected ? 'border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-border/50'
      }`}
      onClick={() => navigate(`/product/${product._id || product.id}`)}
    >
      {/* Inner Image Container with its own Border Radius */}
      <div className="relative w-full h-[140px] sm:h-[240px] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-primary/5 mb-3 sm:mb-4">
        <button 
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/50 text-foreground/70 hover:text-primary hover:bg-background'
          }`}
          onClick={(e) => { e.stopPropagation(); if (isSelected) onRemove(); else onAdd(); }}
        >
          {isSelected ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        
        {/* A glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        <img 
          src={product.image ? getImageUrl(product.image) : "https://via.placeholder.com/400x400?text=No+Image"} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-[1rem] sm:rounded-[1.5rem] opacity-90 mix-blend-screen group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
      </div>

      {/* Content Area Below Image */}
      <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <span className="text-[10px] sm:text-xs text-primary block mb-1">
            {product.category?.name || product.category || 'Uncategorized'}
          </span>
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
  const [productsData, setProductsData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/products');
        const productsList = Array.isArray(data) ? data : (data?.products || data?.data || []);
        setProductsData(productsList);
        
        // Extract unique categories from products
        const uniqueCategories = new Set<string>();
        productsList.forEach((p: any) => {
          const catName = p.category?.name || p.category;
          if (catName && typeof catName === 'string') {
            uniqueCategories.add(catName);
          }
        });
        setCategories(["All", ...Array.from(uniqueCategories)]);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setProductsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const safeProductsData = Array.isArray(productsData) ? productsData : [];

  const handleWhatsAppCheckout = () => {
    const selectedProducts = safeProductsData.filter(p => selectedItems[p._id || p.id]);
    const message = `Hello SK Korean Technologies! I am interested in exploring pricing and details for the following machines:\n\n` + 
                    selectedProducts.map((p, i) => `${i + 1}. ${p.name} (Qty: ${selectedItems[p._id || p.id]})`).join('\n') + 
                    `\n\nPlease provide me with more information.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
  };

  const filteredProducts = safeProductsData.filter(p => {
    const productCategoryName = p.category?.name || p.category || '';
    const productName = p.name || '';
    const productDesc = p.description || '';
    const query = searchQuery.toLowerCase().trim();

    const categoryMatch = activeCategory === "All" || productCategoryName === activeCategory;
    const searchMatch = !query || 
      productName.toLowerCase().includes(query) ||
      productCategoryName.toLowerCase().includes(query) ||
      productDesc.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  if (loading) return <div className="text-center py-20 text-foreground font-semibold">Loading products...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;

  return (
    <section id="products" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              Machinery Catalog
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
            Explore our state-of-the-art collection of Korean laser systems and aesthetic devices, engineered for uncompromising clinical results.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl mt-8 px-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-foreground/50 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
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

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 w-full max-w-4xl">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setVisibleCount(16);
                }}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-card border border-border/50 text-foreground/70 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </motion.div>

        <div className="flex flex-col gap-16 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/40 border border-border/50 rounded-3xl max-w-md mx-auto my-4 w-full shadow-lg">
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-foreground/60 text-sm">Try another search keyword.</p>
            </div>
          ) : (
            (() => {
              // Group products by category
              const groupedProducts = filteredProducts.reduce((acc, product) => {
                const catName = product.category?.name || product.category || 'Uncategorized';
                if (!acc[catName]) {
                  acc[catName] = [];
                }
                acc[catName].push(product);
                return acc;
              }, {} as Record<string, any[]>);

              return Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                <div key={categoryName} className="w-full">
                  <div className="w-full flex justify-center mb-8">
                    <div className="relative inline-block text-center">
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground pb-4">
                        {categoryName}
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
                  {Object.values(selectedItems).reduce((a, b) => a + b, 0)} Machine{Object.values(selectedItems).reduce((a, b) => a + b, 0) > 1 ? 's' : ''} Selected
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
