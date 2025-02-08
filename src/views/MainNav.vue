<template>
  <div>
    <div @click="handleToggle" class="toggleIcon">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <el-menu-item
        v-for="(i, index) in navItem"
        :key="index"
        :index="index + 1"
        @click="openPage(i.path)"
      >
        <i :class="i.icon"></i>
        <span slot="title">{{ i.text }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isCollapse: function () {
      return this.$store.state.isCollapse;
    },
    navItem: function () {
      return [
        {
          icon: "el-icon-s-home",
          text: "Home",
          path: "/",
        },
        {
          icon: "el-icon-edit-outline",
          text: "Exercises",
          path: "/exercise",
        },
        {
          icon: "el-icon-phone-outline",
          text: "Mock interview",
          path: "/exercise",
        },
        {
          icon: "el-icon-document-copy",
          text: "Progress Tracking",
          path: "/",
        },
        {
          icon: "el-icon-guide",
          text: "Coaching",
          path: "/",
        },
        {
          icon: "el-icon-shopping-cart-full",
          text: "Pricing",
          path: "/",
        },
        {
          icon: "el-icon-info",
          text: "About Us",
          path: "/",
        },
        {
          icon: "el-icon-question",
          text: "Help",
          path: "/",
        },
        {
          icon: "el-icon-user",
          text: "Account",
          path: "/",
        },
      ];
    },
  },
  methods: {
    handleToggle() {
      this.$store.commit("handleToggleNav", !this.isCollapse);
    },
    openPage: function (path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.toggleIcon {
  width: 63px;
  text-align: center;
  i {
    font-size: 36px;
  }
}
</style>
