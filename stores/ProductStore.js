import { defineStore, acceptHMRUpdate } from "pinia";
export const useProductStore = defineStore("ProductStore", {
  state: () => {
    const { query: queryParam } = useRoute();

    return {
      /**
       * The listing of all the products
       */
      products: [],

      /**
       * Different ways of fetching the listing of products (filters, order, search)
       */
      filters: {
        "fields.heatLevel": queryParam["fields.heatLevel"] || "",
        order: queryParam.order || "",
        query: queryParam.query || "",
      },

      /**
       * A single project to show all the details of
       */
      singleProduct: null,
    };
  },
  getters: {
    activeFilters() {
      const clone = JSON.parse(JSON.stringify(this.filters));
      // remove blank object properties
      return Object.fromEntries(
        Object.entries(clone).filter(([_, v]) => v != null)
      );
    },
  },
  actions: {
    async fetchProducts() {
      //Fetching local data from JSON file
      // const res = await $fetch("/api/products");
      // this.products = res;
      const { $contentful } = useNuxtApp();
      const entries = await $contentful.getEntries({
        content_type: "product",
        ...this.filters
      });

      this.products = entries.items;

      return this.products;
    },
    async fetchProduct(id) {
      //Fetching local data from JSON file
      // const products = await this.fetchProducts();
      // this.singleProduct = products.find((p) => {
      //   return p.sys.id === id;
      // });
      const { $contentful } = useNuxtApp();
      this.singleProduct = await $contentful.getEntry(id);
      return this.singleProduct;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
