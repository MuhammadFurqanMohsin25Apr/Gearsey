import { create } from 'zustand';
import type { Listing } from '@/types';

interface CartItem extends Listing {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Listing) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: Listing) =>
    set((state) => {
      const existingItem = state.items.find((i) => i._id === item._id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }),

  removeItem: (itemId: string) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== itemId),
    })),

  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i._id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalAmount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
