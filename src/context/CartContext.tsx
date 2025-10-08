"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/catalog';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  console.log('CartProvider renderizado, items atuais:', items);

  const addItem = (product: Product, quantity: number) => {
    console.log('CartContext - addItem chamado:', product.name, quantity);
    setItems((prevItems) => {
      console.log('CartContext - Items anteriores:', prevItems.length);
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        console.log('CartContext - Item já existe, atualizando quantidade');
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      console.log('CartContext - Adicionando novo item');
      const newItems = [...prevItems, { product, quantity }];
      console.log('CartContext - Novo total de items:', newItems.length);
      return newItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  console.log('useCart chamado, context:', context ? 'OK' : 'UNDEFINED');
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
