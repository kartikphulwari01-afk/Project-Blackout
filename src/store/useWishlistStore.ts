import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  itemIds: string[];
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      itemIds: [],
      toggleItem: (id) => {
        const items = get().itemIds;
        if (items.includes(id)) {
          set({ itemIds: items.filter(i => i !== id) });
        } else {
          set({ itemIds: [...items, id] });
        }
      },
      hasItem: (id) => get().itemIds.includes(id),
    }),
    { name: 'mosaic-wishlist' }
  )
);
