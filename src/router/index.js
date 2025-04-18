import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home View",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/exercise/:mode",
    name: "Exercise View",
    component: () => import("../views/ExerciseView.vue"),
  },
  {
    path: "/history",
    name: "History View",
    component: () => import("../views/HistoryView.vue"),
  },
  {
    path: "/signinup",
    name: "SignInUP View",
    component: () => import("../views/SignInUP.vue"),
  },
  {
    path: "/account",
    name: "Account View",
    component: () => import("../views/AccountView.vue"),
  },
  {
    path: "/verify-email/:token",
    name: "verify-email",
    component: () => import("../views/VerifyEmail.vue"),
  },
  {
    path: "/GoogleCallback",
    name: "GoogleCallback",
    component: () => import("../views/GoogleCallback.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
    return savedPosition || { x: 0, y: 0 };
  },
});

// 重写路由的 push 方法
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (err.name !== "NavigationDuplicated") throw err;
  });
};

router.onError((error) => {
  // 忽略重定向和中止导航的错误
  if (
    error.name !== "NavigationRedirected" &&
    error.name !== "NavigationAborted"
  ) {
    console.error("Global navigation error:", error);
  }
});

export default router;
