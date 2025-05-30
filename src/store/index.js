import Vue from "vue";
import Vuex from "vuex";
import request from "./request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    themeMode: "light",
    loading: false,
    loginStatus: false,
    loginFromRoute: "",
    loginResponse: {},
    signupResponse: {},
    verifyEmailResponse: {},
    userProfile: {},
    blogs: [],
    chatInfo: {},
    chatHistory: [],
    chatHistoryDetail: {},
    finalAssessmentDetail: {},
    finalAssessmentReport: {},
    conversationID: "",
    achievementStats: {},
    checkOutUrl: {},
    billingTransactions: {},
    billingProfile: {},
    cancelSubscriptionResponse: {},
    jobSearchResults: [],
    jobDetail: {},
  },
  getters: {},
  mutations: {
    setThemeMode(state, payload) {
      state.themeMode = payload;
    },
    switchLoadingStatus(state, payload) {
      state.loading = payload;
    },
    setLoginStatus(state, payload) {
      state.loginStatus = payload;
    },
    setLogininFrom(state, payload) {
      state.loginFromRoute = payload;
    },
    login(state, payload) {
      state.loginResponse = payload;
    },
    signup(state, payload) {
      state.signupResponse = payload;
    },
    verifyEmail(state, payload) {
      state.verifyEmailResponse = payload;
    },
    getUserInfo(state, payload) {
      state.userProfile = payload;
    },
    getBlogs(state, payload) {
      state.blogs = payload;
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
    getFinalAssessmentReport(state, payload) {
      state.finalAssessmentReport = payload;
    },
    setConversationID(state, payload) {
      state.conversationID = payload;
    },
    getAchievementStats(state, payload) {
      state.achievementStats = payload;
    },
    createCheckoutSession(state, payload) {
      state.checkOutUrl = payload;
    },
    getBillingTransactions(state, payload) {
      state.billingTransactions = payload;
    },
    getBillingProfile(state, payload) {
      state.billingProfile = payload;
    },
    cancelSubscription(state, payload) {
      state.cancelSubscriptionResponse = payload;
    },
    jobSearch(state, payload) {
      state.jobSearchResults = payload;
    },
    setJobDetail(state, payload) {
      state.jobDetail = payload;
    },
  },
  actions: {
    async login({ commit }, data) {
      let res = await request("post", "accounts/login/", data);
      localStorage.setItem("Authorization", res.access);
      commit("setLoginStatus", true);
      commit("login", res);
    },
    async googleLogin({ commit }, data) {
      // Send as form-urlencoded data
      const params = new URLSearchParams();
      params.append("code", data);

      let res = await request("post", "auth/google/callback/", params);
      localStorage.setItem("Authorization", res.access_token);
      commit("setLoginStatus", true);
    },
    async signup({ commit }, data) {
      let res = await request("post", "accounts/register/", data);
      commit("signup", res);
    },
    async changePassword(commit, data) {
      await request("post", "accounts/change-password/", data);
    },
    async forgotPassword(commit, data) {
      await request("post", "accounts/password-reset/", data);
    },
    async passwordResetConfirm(commit, data) {
      await request(
        "post",
        `accounts/password-reset-confirm/${data.id}/${data.token}`,
        data
      );
    },
    async verifyEmail({ commit }, data) {
      let res = await request("get", `accounts/verify-email/${data}/`);
      commit("verifyEmail", res);
    },
    async getUserInfo({ commit }) {
      let res = await request("get", "accounts/userinfo/");
      commit("getUserInfo", res.data);
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
    async getFinalAssessmentReport({ commit }, data) {
      let res = await request("get", `jobapp/assessment-pdf-report/${data}/`);
      commit("getFinalAssessmentReport", res);
    },
    async getAchievementStats({ commit }) {
      let res = await request("get", "jobapp/stats/");
      commit("getAchievementStats", res?.data);
    },
    //price
    async createCheckoutSession({ commit }, data) {
      let res = await request("post", "billing/create-checkout-session/", data);
      commit("createCheckoutSession", res.data);
    },
    async getBillingTransactions({ commit }) {
      let res = await request("get", "billing/transactions/");
      commit("getBillingTransactions", res.data);
    },
    async getBillingProfile({ commit }) {
      let res = await request("get", "billing/profile/");
      commit("getBillingProfile", res.data);
    },
    async cancelSubscription({ commit }) {
      let res = await request("post", "billing/subscription/cancel/", {
        cancel_immediately: false,
      });
      commit("cancelSubscription", res.data);
    },
    async jobSearch({ commit }, data) {
      let res = await request("get", `jobapp/jobs/?category=${data}`);
      commit("jobSearch", res.data);
    },
  },

  modules: {},
});
