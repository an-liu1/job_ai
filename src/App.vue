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
// 覆盖Element UI确认框样式
.el-message-box {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  width: 520px !important;

  &__header {
    padding: 20px 20px 15px !important;
    background: linear-gradient(to right, #0295ff, #3cabff) !important;

    .el-message-box__title {
      color: white !important;
      font-weight: 600 !important;
      font-size: 18px !important;
    }

    .el-message-box__headerbtn {
      top: 20px !important;
      right: 20px !important;

      .el-message-box__close {
        color: white !important;
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
      color: #606266 !important;
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
        background: linear-gradient(to right, #0295ff, #3cabff) !important;
        border: none !important;
      }
    }
  }
}

// 不同类型对话框的图标颜色
.el-message-box__status {
  &.el-icon-info {
    color: #409eff !important;
  }
  &.el-icon-success {
    color: #67c23a !important;
  }
  &.el-icon-warning {
    color: #e6a23c !important;
  }
  &.el-icon-error {
    color: #f56c6c !important;
  }
}
</style>
