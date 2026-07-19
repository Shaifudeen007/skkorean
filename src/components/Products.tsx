import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CheckCircle2, Circle, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

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
      onClick={() => navigate(`/product/${product.id}`)}
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
      
      {/* A glowing backdrop to make the machine look like it's in a studio */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover rounded-[1rem] sm:rounded-[1.5rem] opacity-90 mix-blend-screen group-hover:scale-110 transition-transform duration-700 ease-out" 
      />
    </div>

    {/* Content Area Below Image */}
    <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="font-outfit font-bold text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-[10px] sm:text-xs text-foreground/60 line-clamp-2 mb-2 sm:mb-4 leading-relaxed">{product.description}</p>
      </div>
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-2 gap-2 xl:gap-0">
        {product.price ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-foreground/50 line-through">
                {product.originalPrice}
              </span>
            )}
            <span className="font-outfit font-bold text-base sm:text-xl text-foreground">
              {product.price}
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

const CATEGORIES = ["All", "Machine", "Aesthetic Products", "PMU Products", "Korean Products"];

const MACHINE_FILTERS = [
  { label: "Diode & Pico Laser", keywords: ["diode"] },
  { label: "CO2 Fractional Laser", keywords: ["co2"] },
  { label: "Active Pico Laser", keywords: ["pico", "q-switched"] },
  { label: "Premium Hydra Machines", keywords: ["hydra facial", "hydra plus", "dynamic hydra", "superbubble", "oxygen hydra", "premium hydra"] },
  { label: "Cryolipolysis", keywords: ["cryo"] },
  { label: "Laser Hair & Regrowth", keywords: ["hair removal", "laser hair device"] },
  { label: "AI Analyzers", keywords: ["ai skin", "ai imager", "ai scalp"] },
  { label: "HIFU", keywords: ["hifu"] },
  { label: "Derma Beds", keywords: ["bed"] }
];

const Products = () => {
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState("Machine");
  const [visibleCount, setVisibleCount] = useState(16);

  const handleAdd = (id: number) => {
    setSelectedItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id: number) => {
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
    const selectedProducts = PRODUCTS.filter(p => selectedItems[p.id]);
    const message = `Hello SK Korean Technologies! I am interested in exploring pricing and details for the following machines:\n\n` + 
                    selectedProducts.map((p, i) => `${i + 1}. ${p.name} (Qty: ${selectedItems[p.id]})`).join('\n') + 
                    `\n\nPlease provide me with more information.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const categoryMatch = activeCategory === "All" || p.category === activeCategory;
    if (!categoryMatch) return false;
    return true;
  });

  return (
    <section id="products" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16 text-center"
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

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-12 w-full max-w-4xl">
            {CATEGORIES.map(category => (
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

        {activeCategory === "Machine" ? (
          <div className="flex flex-col gap-16 w-full">
            {MACHINE_FILTERS.map(filter => {
              const sectionProducts = filteredProducts.filter(p => {
                const searchString = `${p.name} ${p.description} ${p.longDescription?.keyBenefits?.join(' ') || ''}`.toLowerCase();
                return filter.keywords.some(kw => searchString.includes(kw.toLowerCase()));
              });

              if (sectionProducts.length === 0) return null;

              return (
                <div key={filter.label} className="w-full">
                  <div className="w-full flex justify-center mb-8">
                    <div className="relative inline-block text-center">
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-foreground pb-4">
                        {filter.label}
                      </h3>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {sectionProducts.map((product, i) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={i} 
                        quantity={selectedItems[product.id] || 0}
                        onAdd={() => handleAdd(product.id)}
                        onRemove={() => handleRemove(product.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, visibleCount).map((product, i) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={i} 
                quantity={selectedItems[product.id] || 0}
                onAdd={() => handleAdd(product.id)}
                onRemove={() => handleRemove(product.id)}
              />
              ))}
            </AnimatePresence>
          </div>
        )}

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
