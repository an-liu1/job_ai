import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: true,
  },
  getters: {},
  mutations: {
    handleToggleNav(state, payload) {
      state.isCollapse = payload;
    },
  },
  actions: {},
  modules: {},
});
