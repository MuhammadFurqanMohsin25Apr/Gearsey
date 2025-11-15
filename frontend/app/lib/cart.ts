import type { Listing } from "~/types";

export interface CartItem {
  id: string;
  product: Listing;
  quantity: number;
}

const CART_STORAGE_KEY = "gearsey_cart";

export const cartManager = {
  // Get all cart items from local storage
  getCart: (): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Add item to cart
  addItem: (product: Listing, quantity: number = 1): CartItem[] => {
    const cart = cartManager.getCart();
    const existingItem = cart.find((item) => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product._id,
        product,
        quantity,
      });
    }

    cartManager.saveCart(cart);
    return cart;
  },

  // Remove item from cart
  removeItem: (productId: string): CartItem[] => {
    const cart = cartManager.getCart();
    const filtered = cart.filter((item) => item.id !== productId);
    cartManager.saveCart(filtered);
    return filtered;
  },

  // Update item quantity
  updateQuantity: (productId: string, quantity: number): CartItem[] => {
    const cart = cartManager.getCart();
    const item = cart.find((i) => i.id === productId);
    if (item) {
      if (quantity <= 0) {
        return cartManager.removeItem(productId);
      }
      item.quantity = quantity;
      cartManager.saveCart(cart);
    }
    return cart;
  },

  // Clear entire cart
  clearCart: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  // Save cart to local storage
  saveCart: (cart: CartItem[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to notify listeners (like Header component)
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Get cart total
  getTotal: (cart: CartItem[] = cartManager.getCart()): number => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  // Get cart item count
  getItemCount: (cart: CartItem[] = cartManager.getCart()): number => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get unique item count (number of different products)
  getUniqueItemCount: (cart: CartItem[] = cartManager.getCart()): number => {
    return cart.length;
  },
};
