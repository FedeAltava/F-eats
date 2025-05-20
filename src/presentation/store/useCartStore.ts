import { create } from "zustand";

import { Dish } from "../../domain/entities/Dish";

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addDish: (dish: Dish) => void;
  removeDish: (dishId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addDish: (dish) => {
    const items = get().items;
    const idx = items.findIndex(i => i.dish.id.value === dish.id.value);
    if (idx >= 0) {
      // incrementa cantidad
      const newItems = [...items];
      newItems[idx].quantity += 1;
      set({ items: newItems });
    } else {
      set({ items: [...items, { dish, quantity: 1 }] });
    }
  },

  removeDish: (dishId) => {
    const items = get().items.filter(i => i.dish.id.value !== dishId);
    set({ items });
  },

  clearCart: () => {
    set({ items: [] });
  }
}));
