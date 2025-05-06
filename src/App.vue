<template>
  <div id="app" v-loading.fullscreen="loading">
    <!-- Start Preloader Section -->
    <div :class="{ preloader: true, 'preloader-deactivate': isPageLoaded }">
      <div class="loader">
        <div class="jobace-text">JobACE</div>
      </div>
    </div>
    <!-- End Preloader Section -->

    <NavBar v-if="isRouterAlive" />

    <router-view v-if="isRouterAlive" />

    <Footer />

    <BackToTop />
  </div>
</template>

<script>
import NavBar from "@/views/NavBar.vue";
import Footer from "@/views/Footer.vue";
import BackToTop from "@/components/BackToTop.vue";
export default {
  name: "app",
  components: {
    NavBar,
    Footer,
    BackToTop,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      isPageLoaded: false,
    };
  },
  computed: {
    loading: function () {
      return this.$store.state.loading;
    },
  },

  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  created() {
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
  mounted() {
    this.$store.commit("switchLoadingStatus", false);
    // 监听 window 的 load 事件，当页面完全加载完成后执行回调
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.isPageLoaded = true;
      }, 500);
    });
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器，避免内存泄漏
    window.removeEventListener("load", () => {
      this.isPageLoaded = true;
    });
  },
};
</script>

<style lang="scss">
body {
  margin: 0 !important;
  padding: 0 !important;
  font-family: Arial !important;
}
</style>
