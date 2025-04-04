<template>
  <div id="app" v-loading.fullscreen="loading">
    <!-- <div class="banner">
      <el-image :src="logoImg"></el-image>
    </div> -->
    <!-- Start Preloader Section -->
    <div :class="{ preloader: true, 'preloader-deactivate': isPageLoaded }">
      <div class="loader">
        <div class="shadow"></div>
        <div class="box"></div>
      </div>
    </div>
    <!-- End Preloader Section -->
    <div
      :style="
        isCollapse ? 'width: 63px !important;' : 'width: 199px !important;'
      "
      class="mainNav"
      v-if="mobileScreenWidth"
    >
      <SideNav />
    </div>
    <NavBar v-if="!mobileScreenWidth" />

    <router-view v-if="isRouterAlive" />
    <Footer />
  </div>
</template>

<script>
import SideNav from "@/views/SideNav.vue";
import NavBar from "@/views/NavBar.vue";
import Footer from "@/views/Footer.vue";
export default {
  name: "app",
  components: {
    SideNav,
    NavBar,
    Footer,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      logoImg: require("@/assets/logo.png"),
      isPageLoaded: false,
    };
  },
  computed: {
    isCollapse: function () {
      return this.$store.state.isCollapse;
    },
    loading: function () {
      return this.$store.state.loading;
    },
    mobileScreenWidth: function () {
      return window.innerWidth < 1200;
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
      }, 1000);
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
.banner {
  height: 80px;
  width: 100%;
  text-align: center;
  .el-image {
    height: 60px;
    margin-top: 10px;
  }
}
.mainNav {
  background-color: #ffffff;
  position: fixed !important;
  top: 180px;
  left: 0;
  z-index: 999;
}
</style>
