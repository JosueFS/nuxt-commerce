<script setup>
const productStore = useProductStore();
useAsyncData("products", async () => productStore.fetchProducts());
</script>

<template>
  <div>
    <HomeHero />

    <div class="flex justify-end mt-10 px-10">
      <ProductFilters />
    </div>

    <transition-group
      v-if="productStore.products"
      name="products"
      tag="div"
      class="
        products
        gap-7
        p-10
        sm:grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        flex-wrap
        justify-items-stretch
        items-stretch
      "
    >
      <ProductCard
        v-for="product in productStore.products"
        :key="product.sys.id"
        :product="product"
        class="mb-5 product"
      />
    </transition-group>
  </div>
</template>

<style scoped>
/* Animations */
.product {
  transition: all 0.35s ease-in-out;
}
.products-enter {
  transform: scale(0.5) translatey(-80px);
  opacity: 0;
}

.products-leave-to {
  transform: translatey(30px);
  opacity: 0;
}

.products-leave-active {
  position: absolute;
  z-index: -1;
}
</style>
