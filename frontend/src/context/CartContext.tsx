import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextType {
  cartItems: Record<string, CartItem>;
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});

  const addItem = (product: any) => {
    const id = product._id || product.id;
    setCartItems((prev) => {
      const existing = prev[id];
      if (existing) {
        return { ...prev, [id]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...prev, [id]: { product, quantity: 1 } };
    });
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      
      const newItems = { ...prev };
      if (existing.quantity > 1) {
        newItems[productId] = { ...existing, quantity: existing.quantity - 1 };
      } else {
        delete newItems[productId];
      }
      return newItems;
    });
  };

  const clearCart = () => setCartItems({});

  const totalItems = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
