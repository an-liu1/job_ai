import Vue from "vue";
import Vuex from "vuex";
import request from "./request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    isCollapse: true,
    loginStatus: false,
    signupResponse: {},
    blogs: [],
    practiceMode: "",
    showPractice: false,
    chatInfo: {},
    chatHistory: [],
    chatHistoryDetail: {},
    finalAssessmentDetail: {},
    conversationID: "",
  },
  getters: {},
  mutations: {
    switchLoadingStatus(state, payload) {
      state.loading = payload;
    },
    handleToggleNav(state, payload) {
      state.isCollapse = payload;
    },
    setLoginStatus(state, payload) {
      state.loginStatus = payload;
    },
    signup(state, payload) {
      state.signupResponse = payload;
    },
    getUserProfile(state, payload) {
      state.userProfile = payload;
    },
    getBlogs(state, payload) {
      state.blogs = payload;
    },
    setPracticeMode(state, payload) {
      state.practiceMode = payload;
    },
    switchShowPractice(state, payload) {
      state.showPractice = payload;
    },
    getChatInfo(state, payload) {
      state.chatInfo = payload;
    },
    getChatHistory(state, payload) {
      state.chatHistory = payload;
    },
    getChatHistoryDetail(state, payload) {
      state.chatHistoryDetail = payload;
    },
    getFinalAssessmentDetail(state, payload) {
      state.finalAssessmentDetail = payload;
    },
    setConversationID(state, payload) {
      state.conversationID = payload;
    },
  },
  actions: {
    async login({ commit }, data) {
      let res = await request("post", "accounts/login/", data);
      localStorage.setItem("Authorization", res.tokens.access);
      commit("setLoginStatus", true);
    },
    async signup({ commit }, data) {
      let res = await request("post", "accounts/register/", data);
      commit("signup", res);
    },
    // async getUserProfile({ commit }) {
    //   let res = await request("get", "accounts/profile/");
    //   commit("getUserProfile", res);
    // },
    async getUserInfo({ commit }) {
      let res = await request("get", "accounts/userinfo/");
      commit("getUserProfile", res);
    },
    async getBlogs({ commit }) {
      let res = await request("get", "blog_posts/");
      commit("getBlogs", res.results);
    },
    async getChatInfo({ commit }, data) {
      let res = await request("post", "jobapp/chat/", data);
      commit("getChatInfo", res);
    },
    async getChatHistory({ commit }) {
      let res = await request("get", "jobapp/history/");
      commit("getChatHistory", res);
    },
    async getChatHistoryDetail({ commit }, data) {
      let res = await request("get", `jobapp/history/${data}/`);
      commit("getChatHistoryDetail", res);
    },
    async getFinalAssessmentDetail({ commit }, data) {
      let res = await request("post", `jobapp/final-assessment/${data}/`);
      commit("getFinalAssessmentDetail", res);
    },
  },

  modules: {},
});
