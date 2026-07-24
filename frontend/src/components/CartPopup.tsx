import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

const CartPopup = () => {
  const { totalItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg"
          >
            <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_10px_40px_rgba(212,175,55,0.3)] rounded-full px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="font-outfit font-bold text-foreground text-sm sm:text-base">
                  {totalItems} Item{totalItems > 1 ? 's' : ''} Selected
                </span>
                <span className="text-[10px] sm:text-xs text-foreground/70">Ready for consultation</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Selection</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default CartPopup;
