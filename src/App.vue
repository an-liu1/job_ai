<template>
  <div id="app" v-loading.fullscreen="loading">
    <!-- Start Preloader Section -->
    <!-- <div :class="{ preloader: true, 'preloader-deactivate': isPageLoaded }">
      <div class="loader">
        <div class="jobace-text">JobACE</div>
      </div>
    </div> -->
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
/*CSS Reset*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  font-weight: inherit;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700 !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

body {
  margin: 0 !important;
  padding: 0 !important;
  font-family: Arial !important;
}
// Theme Initialization (add this at the beginning of your styles)
:root {
  // Initialize with light theme as default
  @each $key, $value in $theme-light {
    --#{$key}: #{$value};
  }
}

[data-theme="dark"] {
  @each $key, $value in $theme-dark {
    --#{$key}: #{$value};
  }
}

// Component Styling (updated to use CSS variables)
.pageContainer {
  padding: 100px 20px 20px 20px;
  background: var(--bg-base);
}

h1,
h2,
h3 {
  color: var(--text-primary);
}

h4,
h5 {
  color: var(--text-secondary);
}

p {
  color: var(--text-p);
}

a {
  color: var(--text-white);
}

.text-link {
  color: var(--link-color);
  &:hover {
    color: var(--link-hover);
  }
}

.icon-color {
  color: var(--icon-color);
  &:hover {
    color: var(--icon-hover);
  }
}

.homeBackground {
  background: var(--bg-secondary);
}

.default-btn {
  position: relative;
  z-index: 1;
  overflow: hidden;
  color: var(--text-white);
  font-size: 16px;
  font-weight: 600;
  padding: 10px 30px;
  border-radius: 5px;
  text-align: center;
  background-color: var(--btn-primary);
  box-shadow: 0 7px 25px rgba(123, 104, 238, 0.25);
  border: none;
  margin-top: 5px;
  cursor: pointer;
  transition: color 0.4s;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 0;
    height: 0;
    border-radius: 30px;
    background-color: var(--btn-primary-hover);
    transform: translate(-50%, -50%);
    transition: width 0.5s ease-in-out, height 0.5s ease-in-out;
    left: 50%;
    top: 50%;
  }

  &:hover,
  &:focus {
    color: var(--btn-primary);
    outline: none;

    &::before {
      width: 200%;
      height: 500px;
    }
  }
}

// Dark mode specific adjustments
[data-theme="dark"] {
  .default-btn {
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.3);
  }

  // Add any other dark-mode specific overrides here
}

// 覆盖Element UI确认框样式
.el-message-box {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  width: 520px !important;

  &__header {
    padding: 20px 20px 15px !important;
    background: var(--pop-up-main-color) !important;

    .el-message-box__title {
      color: var(--text-white) !important;
      font-weight: 600 !important;
      font-size: 18px !important;
    }

    .el-message-box__headerbtn {
      top: 20px !important;
      right: 20px !important;

      .el-message-box__close {
        color: var(--text-white) !important;
      }
    }
  }

  &__content {
    padding: 25px 20px !important;
    display: flex !important;
    align-items: flex-start !important;
    gap: 15px !important;

    .el-message-box__message {
      font-size: 15px !important;
      line-height: 1.6 !important;
      margin-left: 0 !important;
    }

    .el-message-box__status {
      font-size: 24px !important;
      margin-top: 2px !important;
    }
  }

  &__btns {
    padding: 15px 20px 20px !important;
    text-align: right !important;

    .el-button {
      padding: 10px 20px !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      transition: all 0.3s !important;
      font-size: 14px !important;

      &:first-child {
        margin-right: 10px !important;
      }

      &.el-button--primary {
        background: var(--pop-up-main-color) !important;
        border: none !important;
      }
    }
  }
}

// 不同类型对话框的图标颜色
.el-message-box__status {
  &.el-icon-info {
    color: var(--pop-up-main-color) !important;
  }
}
</style>
