<template>
  <div v-if="isVisible" class="back-to-top" @click="scrollToTop">
    <i class="fa-solid fa-arrow-up"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isVisible = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: var(--backtotop-color);
  color: var(--text-white);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.back-to-top:hover {
  opacity: 1;
}
</style>
