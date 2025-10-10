import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Product } from '@/types/catalog';

// Mock product for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 10.0,
  image: '/test-image.jpg',
  isAvailable: true,
  categoryId: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  nutritionalInfo: {
    calories: 100,
    proteins: 5,
    carbohydrates: 20,
    fats: 3,
    fiber: 2,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProduct2: Product = {
  ...mockProduct,
  id: '2',
  name: 'Test Product 2',
  price: 20.0,
};

describe('CartContext', () => {
  it('should throw error when useCart is used outside CartProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
    
    consoleError.mockRestore();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe('1');
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should increment quantity when adding existing item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      act(() => {
        result.current.addItem(mockProduct, 3);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(5);
    });

    it('should add multiple different products', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 1);
        result.current.addItem(mockProduct2, 2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].product.id).toBe('1');
      expect(result.current.items[1].product.id).toBe('2');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
        result.current.addItem(mockProduct2, 1);
      });

      act(() => {
        result.current.removeItem('1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe('2');
    });

    it('should handle removing non-existent item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 1);
      });

      act(() => {
        result.current.removeItem('non-existent');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      act(() => {
        result.current.updateQuantity('1', 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is zero', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      act(() => {
        result.current.updateQuantity('1', 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      act(() => {
        result.current.updateQuantity('1', -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
        result.current.addItem(mockProduct2, 3);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return total quantity of items', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
        result.current.addItem(mockProduct2, 3);
      });

      expect(result.current.getTotalItems()).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.getTotalItems()).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2); // 10 * 2 = 20
        result.current.addItem(mockProduct2, 3); // 20 * 3 = 60
      });

      expect(result.current.getTotalPrice()).toBe(80);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('should update price when quantity changes', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProduct, 2);
      });

      expect(result.current.getTotalPrice()).toBe(20);

      act(() => {
        result.current.updateQuantity('1', 5);
      });

      expect(result.current.getTotalPrice()).toBe(50);
    });
  });
});
