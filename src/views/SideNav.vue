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
        :index="(index + 1).toString()"
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
          text: "Practice questions",
          path: "/exercise",
        },
        {
          icon: "el-icon-phone-outline",
          text: "Mock interview",
          path: "/mockInterview",
        },
        {
          icon: "el-icon-guide",
          text: "History",
          path: "/history",
        },
        // {
        //   icon: "el-icon-document-copy",
        //   text: "Progress Tracking",
        //   path: "/",
        // },
        // {
        //   icon: "el-icon-guide",
        //   text: "Coaching",
        //   path: "/",
        // },
        // {
        //   icon: "el-icon-shopping-cart-full",
        //   text: "Pricing",
        //   path: "/",
        // },
        // {
        //   icon: "el-icon-info",
        //   text: "About Us",
        //   path: "/about",
        // },
        // {
        //   icon: "el-icon-question",
        //   text: "Help",
        //   path: "/",
        // },
        {
          icon: "el-icon-user",
          text: "Account",
          path: "/account",
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
      this.$store.commit("handleToggleNav", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-item [class^="el-icon-"] {
  font-size: 24px;
}

.toggleIcon {
  width: 63px;
  text-align: center;
  i {
    font-size: 36px;
  }
}
</style>
