interface Item {
  sys: {
    id: string;
  };

  fields: {
    name: string;
    price: number;
    image: [ItemImage];
  };

  amount: number;
}

interface ItemImage {
  fields: {
    title: string;
    file: {
      url: string;
    };
  };
}

export const useCartStore = defineStore("CartStore", {
  state: () => ({
    items: [] as Item[],
  }),

  getters: {
    itemsAmount(state) {
      return state.items.reduce((acc, item) => acc + item.amount, 0);
    },
    subTotal(state) {
      return state.items.reduce(
        (acc, item) => acc + item.fields.price * item.amount,
        0
      );
    },
    taxTotal(): number {
      return this.subTotal * 0.1;
    },
    total(): number {
      return this.subTotal + this.taxTotal;
    },
  },

  actions: {
    addToCart(item: Item, amount: number) {
      const existingItem = this.items.find((i) => i.sys.id === item.sys.id);

      if (existingItem) {
        existingItem.amount++;
      } else {
        this.items.push({ ...item, amount });
      }
    },
    removeFromCart(itemId: string) {
      const index = this.items.findIndex((item) => item.sys.id === itemId);

      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot));
}
