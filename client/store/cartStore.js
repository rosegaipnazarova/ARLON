import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ product, quantity }]

      addItem: (product, quantity = 1) => {
        set((s) => {
          const existing = s.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.remainingQuantity) }
                  : i
              ),
            };
          }
          return { items: [...s.items, { product, quantity }] };
        });
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product._id !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'arlon-cart' }
  )
);

export default useCartStore;
