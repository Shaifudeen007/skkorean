import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, addItem, removeItem, totalItems } = useCart();

  const handleWhatsAppCheckout = () => {
    const items = Object.values(cartItems);
    if (items.length === 0) return;
    
    const message = `Hello SK Korean Technologies! I am interested in exploring pricing and details for the following products:\n\n` + 
                    items.map((item, i) => `${i + 1}. ${item.product.name} (Qty: ${item.quantity})`).join('\n') + 
                    `\n\nPlease provide me with more information.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-card border border-border/50 shadow-2xl rounded-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-4 sm:p-6 border-b border-border/50 flex justify-between items-center bg-card">
              <h2 className="text-xl font-bold text-foreground">Your Selection ({totalItems})</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-border/50 transition-colors text-foreground/70 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow bg-card/50 space-y-4">
              {Object.values(cartItems).length === 0 ? (
                <div className="text-center text-foreground/60 py-8">
                  Your selection is empty.
                </div>
              ) : (
                Object.values(cartItems).map(({ product, quantity }) => {
                  const displayImage = product.images && product.images.length > 0 
                    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
                    : product.image;

                  return (
                    <div key={product._id || product.id} className="flex gap-4 p-3 rounded-xl bg-background border border-border/50 items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-primary/5 flex-shrink-0">
                        <img 
                          src={displayImage ? getImageUrl(displayImage) : "https://via.placeholder.com/150"} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-primary mb-2 truncate">{product.category?.name || product.category || 'Product'}</p>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeItem(product._id || product.id)}
                            className="w-7 h-7 flex justify-center items-center rounded-full bg-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-medium text-sm w-4 text-center">{quantity}</span>
                          <button 
                            onClick={() => addItem(product)}
                            className="w-7 h-7 flex justify-center items-center rounded-full bg-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-border/50 bg-card">
              <button
                onClick={handleWhatsAppCheckout}
                disabled={Object.values(cartItems).length === 0}
                className="w-full py-3 sm:py-4 rounded-full bg-[#25D366] text-white font-bold text-base sm:text-lg flex justify-center items-center gap-2 hover:bg-[#20bd5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-6 h-6" />
                Send to WhatsApp
              </button>
              <p className="text-center text-xs text-foreground/50 mt-3">
                Our team will assist you with pricing and shipping details.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
