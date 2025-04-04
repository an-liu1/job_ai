import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

//Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

//ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//VueTyperPlugin
import VueTyperPlugin from "vue-typer";
Vue.use(VueTyperPlugin);

//moment js
import moment from "moment";
Vue.prototype.$moment = moment;

import "animate.css";

// const publicRoutes = ["/account", "/"];

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("Authorization");

//   // 如果目标路由是公共路由，直接放行
//   if (publicRoutes.includes(to.path)) {
//     next();
//     return;
//   }

//   // 如果用户未登录或 Token 过期，重定向到登录页
//   if (!token) {
//     localStorage.removeItem("Authorization");
//     next("/account");
//   }
//   // 其他情况，正常放行
//   else {
//     next();
//   }
// });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
