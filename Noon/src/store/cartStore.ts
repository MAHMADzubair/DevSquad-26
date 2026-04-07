import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const qtyToAdd = item.quantity || 1;
        const existing = get().items.find((i) => i.productId === item.productId);
        
        if (existing) {
          const totalAfterAdd = existing.quantity + qtyToAdd;
          const finalQty = Math.min(totalAfterAdd, existing.stock);
          
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: finalQty }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: Math.min(qtyToAdd, item.stock) }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const item = get().items.find(i => i.productId === productId);
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const finalQty = Math.min(quantity, item.stock);
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: finalQty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "noon-cart",
    }
  )
);

interface WishlistStore {
  items: string[]; // productIds
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },
      hasItem: (productId) => get().items.includes(productId),
      getCount: () => get().items.length,
    }),
    { name: "noon-wishlist" }
  )
);
