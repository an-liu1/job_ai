<template>
  <div id="app" v-loading.fullscreen="loading">
    <div class="banner">
      <el-image :src="logoImg"></el-image>
    </div>
    <div
      :style="
        isCollapse ? 'width: 63px !important;' : 'width: 199px !important;'
      "
      class="mainNav"
    >
      <main-nav></main-nav>
    </div>
    <div class="mainContainer">
      <router-view v-if="isRouterAlive" />
    </div>
    <!-- <div class="footer row">
      <ul class="col-3">
        <li><i class="el-icon-platform-eleme"></i></li>
        <li><i class="el-icon-help"></i></li>
        <li><i class="el-icon-picture-outline-round"></i></li>
        <li><i class="el-icon-s-opportunity"></i></li>
      </ul>
      <h4 class="col-6">Job Interview Training</h4>
      <p class="col-3">© Copyright CPMP. All Rights Reserved</p>
    </div> -->
  </div>
</template>

<script>
import MainNav from "@/views/MainNav.vue";
export default {
  name: "app",
  components: { MainNav },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      logoImg: require("@/assets/logo.png"),
    };
  },
  computed: {
    isCollapse: function () {
      return this.$store.state.isCollapse;
    },
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
  top: 100px;
  left: 0;
  z-index: 999;
}
.mainContainer {
  background-color: #f2faff;
  min-height: calc(100vh - 100px);
  // overflow: hidden;
}
.footer {
  height: 50px;
  line-height: 50px;
  width: 100%;
  text-align: center;
  ul {
    list-style-type: none;
    text-align: left;
    padding-left: 50px;
    li {
      display: inline-block;
      padding-right: 15px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  h4 {
    line-height: 50px;
  }
  p {
    line-height: 50px;
    text-align: right;
    padding-right: 30px;
  }
}
</style>
