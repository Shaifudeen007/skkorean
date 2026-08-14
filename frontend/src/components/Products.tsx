import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';

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
      <div className="relative w-full h-[140px] sm:h-[240px] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-primary/5 mb-3 sm:mb-4">
        <button 
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-background/50 text-foreground/70 hover:text-primary hover:bg-background'
          }`}
          onClick={(e) => { e.stopPropagation(); if (isSelected) onRemove(); else onAdd(); }}
        >
          {isSelected ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {(() => {
          const displayImage = product.images && product.images.length > 0 
            ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
            : product.image;

          return (
            <img 
              src={displayImage ? getImageUrl(displayImage) : "https://via.placeholder.com/400x400?text=No+Image"} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-[1rem] sm:rounded-[1.5rem] opacity-90 dark:mix-blend-screen group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          );
        })()}
      </div>

      <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-outfit font-bold text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] sm:text-xs text-primary font-semibold block">
              {product.category?.name || product.category || 'Uncategorized'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-2 gap-2 xl:gap-0">
          <span className="font-outfit font-bold text-sm sm:text-base text-primary uppercase tracking-wider drop-shadow-[0_0_5px_rgba(212,175,55,0.8)] animate-pulse">
            Enquire for best price
          </span>
          
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
              className="w-full xl:w-auto px-2 py-1.5 sm:px-6 sm:py-2.5 rounded-full font-semibold transition-colors text-[10px] sm:text-sm bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
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
  const navigate = useNavigate();
  const { cartItems, addItem, removeItem } = useCart();
  
  const [productsData, setProductsData] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Group by main category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    safeMainCategories.forEach(mc => {
      groups[mc.name] = [];
    });

    safeProductsData.forEach(p => {
      const mainCatName = p.category?.mainCategory?.name;
      if (mainCatName && groups[mainCatName]) {
        groups[mainCatName].push(p);
      }
    });

    return groups;
  }, [safeProductsData, safeMainCategories]);

  if (loading) return (
    <section id="products" className="pt-12 pb-4 relative overflow-hidden scroll-mt-20">
      <div className="flex justify-center items-center py-20 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </section>
  );
  if (error) return (
    <section id="products" className="pt-12 pb-4 relative overflow-hidden scroll-mt-20">
      <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
    </section>
  );

  return (
    <section id="products" className="pt-12 pb-4 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center w-full gap-6 mb-16"
        >
          <div className="relative inline-block text-center md:text-left overflow-visible">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground whitespace-nowrap">
              Featured Categories
            </h2>
            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] md:left-0 md:translate-x-0" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </motion.div>

        <div className="flex flex-col gap-24 w-full">
          {safeMainCategories.map((mc) => {
            const products = groupedProducts[mc.name] || [];
            if (products.length === 0) return null;

            return (
              <div key={mc.id || mc.name} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <div className="relative inline-block text-center sm:text-left">
                    <h3 className="text-3xl font-serif font-bold text-foreground pb-2">
                      {mc.name}
                    </h3>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-16 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                  </div>
                  
                  {/* Show More link hidden as per user request to have button at the bottom */}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  <AnimatePresence mode="popLayout">
                    {products.slice(0, 3).map((product, i) => (
                      <div 
                        key={product._id || product.id} 
                        className={i === 2 ? "col-span-2 sm:col-span-1 px-[25%] sm:px-0" : ""}
                      >
                        <ProductCard 
                          product={product} 
                          index={i} 
                          quantity={cartItems[product._id || product.id]?.quantity || 0}
                          onAdd={() => addItem(product)}
                          onRemove={() => removeItem(product._id || product.id)}
                        />
                      </div>
                    ))}
                    
                    {/* View All Card for 4th spot if there are more products (xl displays 4 cols) */}
                    {products.length > 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="hidden xl:flex group w-full h-[380px] p-3 rounded-[1.5rem] border-[3px] border-border/50 hover:border-primary/50 bg-card/40 backdrop-blur-md items-center justify-center cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                        onClick={() => navigate(`/catalog?mainCategory=${encodeURIComponent(mc.name)}`)}
                      >
                        <div className="flex flex-col items-center gap-4 text-foreground/60 group-hover:text-primary transition-colors">
                          <div className="w-16 h-16 rounded-full bg-border/50 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-8 h-8" />
                          </div>
                          <span className="font-outfit font-bold text-lg">View All {mc.name}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Always show Show More button */}
                <div className="mt-8 flex justify-center">
                   <button 
                    onClick={() => navigate(`/catalog?mainCategory=${encodeURIComponent(mc.name)}`)}
                    className="px-8 py-3 rounded-full border border-border/80 text-foreground text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Show More {mc.name} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
