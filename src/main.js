import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

//Bootstrap
import "bootstrap/dist/css/bootstrap.css";

//ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//VueTyperPlugin
import VueTyperPlugin from "vue-typer";
Vue.use(VueTyperPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
