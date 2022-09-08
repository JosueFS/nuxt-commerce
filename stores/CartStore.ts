import { Ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { defineStore, acceptHMRUpdate } from "pinia";

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

export const useCartStore = defineStore("CartStore", () => {
  //state
  const items = ref([]) as Ref<[Item]>;
  const taxRate = 0.1;
  const deskree = useDeskree();
  const isFirstLoad = ref(true);

  watchDebounced(
    items,
    () => {
      if (!isFirstLoad.value) {
        deskree.user.updateCart(items.value);
      }
    },
    { deep: true, debounce: 500 }
  );

  deskree.auth.onAuthStateChange(async (user) => {
    isFirstLoad.value = true;
    if (!user) return;

    const res = await deskree.user.getCart();
    items.value = res.products;
    //Reason watchDebounce waits 500ms to make request
    setTimeout(() => (isFirstLoad.value = false), 700);
  });

  //getters
  const itemsAmount = computed(() =>
    items.value.reduce((acc, item) => acc + item.amount, 0)
  );
  const subTotal = computed(() => {
    return items.value.reduce(
      (acc, item) => item.fields.price * item.amount + acc,
      0
    );
  });
  const taxTotal = computed(() => subTotal.value * taxRate);
  const total = computed(() => subTotal.value + taxTotal.value);

  //actions
  function addToCart(item: Item, amount: number) {
    const existingItem = items.value.find((i) => i.sys.id === item.sys.id);

    if (existingItem) {
      existingItem.amount++;
    } else {
      items.value.push({ ...item, amount });
    }
  }

  function removeFromCart(itemId: string) {
    const index = items.value.findIndex((item) => item.sys.id === itemId);

    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  return {
    items,
    taxRate,
    itemsAmount,
    subTotal,
    taxTotal,
    total,
    addToCart,
    removeFromCart,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
